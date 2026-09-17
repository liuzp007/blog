# notify-message 配置

该函数只接收站内联系表单的 `name`、`email`、`content`，收件人、发件人和邮件 HTML 均由服务端固定生成。

## 必需环境变量

- `RESEND_API_KEY`：Resend API Key。
- `NOTIFY_EMAIL`：固定收件邮箱。
- `SITE_ORIGIN`：站点完整 Origin，例如 `https://example.com`；函数只允许该 Origin 与本地开发地址调用。

## 可选环境变量

- `NOTIFY_FROM`：Resend 发件人，默认 `信号站 <onboarding@resend.dev>`。生产环境建议替换为已验证域名。

部署后用无登录浏览器提交表单验证邮件可送达，再直接请求函数确认非白名单 Origin 返回 403。
