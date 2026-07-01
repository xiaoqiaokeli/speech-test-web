# 言语测试网站

这是一个面向微信/手机浏览器使用的言语测试静态网站。

## Cloudflare Pages 设置

- Framework preset: None / Static HTML
- Build command: exit 0
- Build output directory: public
- Root directory: 留空

## 讯飞语音听写环境变量

在 Cloudflare Pages 项目中进入 Settings -> Environment variables，添加：

- XFYUN_APP_ID
- XFYUN_API_KEY
- XFYUN_API_SECRET

这些值来自讯飞开放平台“语音听写 IAT”服务。不要把密钥写进前端，也不要提交到 GitHub。