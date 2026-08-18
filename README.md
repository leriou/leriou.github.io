# Leriou's Tavern

基于 [Astro](https://astro.build) + [Fuwari](https://github.com/saicaca/fuwari) 主题的静态博客,由 Hexo 迁移而来。

## 日常写作

```bash
pnpm dev          # 本地预览 http://localhost:4321
pnpm new-post     # 新建文章脚手架(交互式)
pnpm build        # 构建 + 生成搜索索引
```

文章在 `src/content/posts/`,front-matter 格式:

```yaml
---
title: "文章标题"
published: 2025-01-01
category: "分类"
tags: ["标签1", "标签2"]
description: "摘要(可选,会自动提取)"
---
```

## 部署

push 到 `main` 分支 → GitHub Actions 自动构建并发布到 GitHub Pages(`.github/workflows/deploy.yml`)。

> 仓库首次使用前,需在 GitHub 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**(一次性设置)。

## 启用评论(Waline + Neon)

> ⚠️ Waline 原默认数据库 LeanCloud 已宣布停止服务,**不要再用**。现在用 Neon(免费 PostgreSQL)。

后端模板已放在私有仓库 [leriou/waline-comment](https://github.com/leriou/waline-comment)(官方 Vercel 模板),三步开通:

1. **建数据库**:GitHub 账号登录 [Neon](https://console.neon.tech/) → Create Project(区域选 Singapore)→ Dashboard 复制连接信息(host/用户名/密码/库名,端口 5432)
2. **部署后端**:[Vercel](https://vercel.com/new) → Import `leriou/waline-comment` 仓库 → 展开 Environment Variables,添加:
   - `PG_HOST` = Neon 的 host(`ep-xxx...neon.tech`)
   - `PG_PORT` = `5432`
   - `PG_USER` = Neon 用户名(默认 `neondb`)
   - `PG_PASSWORD` = Neon 密码
   - `PG_DB` = Neon 库名(默认 `neondb`)
   - `PG_SSL` = `true`
   - Deploy → 得到地址 `https://xxx.vercel.app`
3. **接到博客**:访问 `https://xxx.vercel.app/ui/register` 注册第一个账号(即管理员);然后填入 `src/config.ts`:

```ts
export const commentConfig = {
  enable: true,
  serverURL: "https://xxx.vercel.app", // 填这里
};
```

评论数据存在你自己的 Neon 数据库里(免费 0.5GB,个人博客用不完),随时可导出迁移。Neon 免费项目闲置会休眠,第一条评论可能有几秒冷启动,属正常现象。

评论组件已内置:自动跟随暗色模式、支持匿名昵称留言、与主题的页面切换动画兼容。

## 旧链接兼容

Hexo 时代的文章 URL(`/<文章名>/`)已全部生成重定向页(构建产物 `public/<旧slug>/index.html` → `/posts/<文件名>/`),外网旧链接和搜索引擎收录不会失效。

## 主题微调入口

- 站点信息/头像/导航: `src/config.ts`
- 主题色(hue)、暗色模式: `src/config.ts` + 右下角设置面板
- 布局样式: `src/styles/` 与各组件
