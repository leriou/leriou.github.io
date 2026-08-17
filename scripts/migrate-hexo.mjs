/**
 * 一次性迁移脚本:Hexo 文章 → Fuwari (Astro) 格式
 *
 * 用法: node scripts/migrate-hexo.mjs
 *
 * 做四件事:
 *  1. 解析 Hexo front-matter,转成 Fuwari schema (title/published/tags/category/description)
 *  2. 文章体:去掉 <!--more--> 标记,正文原样保留
 *  3. 写入 src/content/posts/,文件名保持不变(slug = 文件名)
 *  4. 为每个旧 URL(/<去日期的slug>/)生成 public/<旧slug>/index.html 重定向页,
 *     保住散落在外网的旧链接和 SEO
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve("../leriou.github.io/source/_posts");
const DEST_DIR = path.resolve("src/content/posts");
const REDIRECT_DIR = path.resolve("public");
const NEW_BASE = "/posts";

// ---------- 极简 YAML front-matter 解析(只覆盖 Hexo 用到的子集) ----------
function parseFrontMatter(raw) {
  const fm = {};
  let key = null;
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (m && !line.startsWith("  ") && !line.startsWith("\t")) {
      key = m[1];
      const val = m[2].trim().replace(/^['"]|['"]$/g, "");
      fm[key] = val === "" ? null : val;
    } else if (key && /^\s*-\s+/.test(line)) {
      // 块列表项
      const item = line.replace(/^\s*-\s+/, "").trim().replace(/^['"]|['"]$/g, "");
      if (Array.isArray(fm[key])) fm[key].push(item);
      else if (fm[key] != null) fm[key] = [fm[key], item];
      else fm[key] = [item];
    }
  }
  return fm;
}

const asList = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  const s = String(v).trim();
  if (/^\[.*\]$/.test(s))
    return s
      .slice(1, -1)
      .split(",")
      .map((x) => x.trim().replace(/^['"]|['"]$/g, "")
      )
      .filter(Boolean);
  return s.includes(",") ? s.split(",").map((x) => x.trim()).filter(Boolean) : [s];
};

// ---------- 从正文提取摘要 ----------
function extractDescription(body) {
  const paras = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p &&
        !p.startsWith("#") &&
        !p.startsWith("```") &&
        !p.startsWith("![") &&
        !p.startsWith(">") &&
        !p.startsWith("---")
    );
  if (!paras.length) return "";
  const text = paras[0]
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 链接取文字
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 100 ? text.slice(0, 100) + "…" : text;
}

// ---------- YAML 序列化(输出保证合法) ----------
const q = (s) => JSON.stringify(String(s));
const yamlArray = (arr) =>
  arr.length === 0 ? "[]" : arr.length === 1 ? `[${q(arr[0])}]` : `\n${arr.map((x) => `  - ${q(x)}`).join("\n")}`;

function redirectHtml(to) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${to}">
<link rel="canonical" href="${to}">
<meta name="robots" content="noindex">
<title>文章已迁移</title>
</head>
<body>
<p>本博客已升级,该文章已迁移至 <a href="${to}">新地址</a>,正在为你跳转……</p>
</body>
</html>
`;
}

// ---------- 主流程 ----------
const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith(".md"));
if (!existsSync(DEST_DIR)) await mkdir(DEST_DIR, { recursive: true });

const report = [];
for (const file of files) {
  const raw = await readFile(path.join(SRC_DIR, file), "utf8");

  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) {
    report.push(`[skip] ${file} 无 front-matter`);
    continue;
  }
  const fm = parseFrontMatter(m[1]);
  let body = m[2].replace(/<!--\s*more\s*-->\r?\n?/g, "");

  const title = String(fm.title ?? file.replace(/\.md$/, ""));
  const dateMatch = String(fm.date ?? "").match(/\d{4}-\d{2}-\d{2}/);
  const published = dateMatch ? dateMatch[0] : new Date().toISOString().slice(0, 10);
  const category = asList(fm.categories)[0] ?? "";
  const tags = asList(fm.tags);
  const updatedMatch = fm.updated ? String(fm.updated).match(/\d{4}-\d{2}-\d{2}/) : null;
  const description = extractDescription(body);

  const out = [
    "---",
    `title: ${q(title)}`,
    `published: ${published}`,
    ...(updatedMatch ? [`updated: ${updatedMatch[0]}`] : []),
    ...(category ? [`category: ${q(category)}`] : []),
    ...(tags.length ? [`tags: ${yamlArray(tags)}`] : []),
    ...(description ? [`description: ${q(description)}`] : []),
    "---",
    "",
    body.replace(/^\s+/, ""),
  ].join("\n");

  await writeFile(path.join(DEST_DIR, file), out, "utf8");

  // 旧 URL slug = 文件名去掉日期前缀(Hexo :title 规则)
  const oldSlug = file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  if (oldSlug) {
    const dir = path.join(REDIRECT_DIR, oldSlug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), redirectHtml(`${NEW_BASE}/${file.replace(/\.md$/, "")}/`), "utf8");
  }
  report.push(`[ok] ${file} → ${published} · ${category || "无分类"} · ${tags.length} 标签`);
}

// 旧归档页 /archives/ → 新 /archive/
await mkdir(path.join(REDIRECT_DIR, "archives"), { recursive: true });
await writeFile(
  path.join(REDIRECT_DIR, "archives", "index.html"),
  redirectHtml("/archive/"),
  "utf8"
);

console.log(report.join("\n"));
console.log(`\n共迁移 ${files.length} 篇文章,重定向页已生成到 public/ 下`);
