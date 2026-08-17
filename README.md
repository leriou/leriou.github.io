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

## 启用评论(Waline)

Waline 需要一个免费的后端(评论数据存在你自己的数据库里),部署一次约 5 分钟:

1. 打开 [Waline 官方部署文档](https://waline.js.org/guide/get-started/),选 **Vercel 部署**(免费,一键 Fork)
2. 按引导注册 [LeanCloud 国际版](https://console.leancloud.app/)(免费版配额足够个人博客),把 `AppID`/`AppKey`/`MasterKey` 填入 Vercel 环境变量
3. 部署完成后拿到后端地址(形如 `https://xxx.vercel.app`)
4. 填入 `src/config.ts`:

```ts
export const commentConfig = {
  enable: true,
  serverURL: "https://你的-waline.vercel.app", // 填这里
};
```

5. 访问 `https://你的-waline.vercel.app/ui/register` 注册第一个账号(即管理员)

评论组件已内置:自动跟随暗色模式、支持匿名昵称留言、与主题的页面切换动画兼容。

## 旧链接兼容

Hexo 时代的文章 URL(`/<文章名>/`)已全部生成重定向页(构建产物 `public/<旧slug>/index.html` → `/posts/<文件名>/`),外网旧链接和搜索引擎收录不会失效。

## 主题微调入口

- 站点信息/头像/导航: `src/config.ts`
- 主题色(hue)、暗色模式: `src/config.ts` + 右下角设置面板
- 布局样式: `src/styles/` 与各组件
