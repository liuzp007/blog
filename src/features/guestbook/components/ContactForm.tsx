import { useState } from 'react'
import { Input, Button, message as antMessage } from 'antd'
import { sendEmail } from '@/utils/emailApi'
import { sanitizeText, normalizeWhitespace, hasMaliciousContent } from '@/utils/sanitize'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailValid = emailRegex.test(email.trim())
  const safeName = normalizeWhitespace(name)
  const safeContent = normalizeWhitespace(content)
  const canSubmit = safeName && emailValid && safeContent && !sending

  const handleSubmit = async () => {
    if (!canSubmit) return
    if (
      hasMaliciousContent(safeName) ||
      hasMaliciousContent(safeContent) ||
      hasMaliciousContent(email.trim())
    ) {
      antMessage.error('内容包含不允许的字符')
      return
    }
    setSending(true)
    try {
      const escName = sanitizeText(safeName)
      const escEmail = sanitizeText(email.trim())
      const escContent = sanitizeText(safeContent).replace(/\n/g, '<br>')
      await sendEmail({
        subject: `来自「${safeName}」的联系邮件`,
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#111;color:#eee;border-radius:12px;">
            <h2 style="margin:0 0 16px;font-size:18px;color:#d4a853;">新的联系邮件</h2>
            <p style="margin:0 0 4px;font-size:14px;color:#888;">发件人：<strong style="color:#eee;">${escName}</strong></p>
            <p style="margin:0 0 16px;font-size:14px;color:#888;">邮箱：<a href="mailto:${escEmail}" style="color:#5ba;">${escEmail}</a></p>
            <div style="padding:12px 16px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:15px;line-height:1.6;">${escContent}</div>
            <p style="margin:16px 0 0;font-size:12px;color:#555;">${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
          </div>
        `
      })
      antMessage.success('邮件已发送，我会尽快回复')
      setName('')
      setEmail('')
      setContent('')
    } catch {
      antMessage.error('发送失败，请稍后再试')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="contact-form-card">
      {/* Header */}
      <div className="contact-form-card__header">
        <div className="contact-form-card__icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div>
          <div className="contact-form-card__title">联系我</div>
          <div className="contact-form-card__subtitle">通过邮件联系我</div>
        </div>
      </div>

      {/* Name + Email row */}
      <div className="contact-form-card__fields">
        <Input
          placeholder="怎么称呼？"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={30}
          className="contact-form-input"
        />
        <Input
          placeholder="怎么联系？"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          maxLength={100}
          status={email && !emailValid ? 'error' : undefined}
          className={`contact-form-input ${email && !emailValid ? 'contact-form-input--error' : ''}`}
        />
      </div>

      {/* Message */}
      <div className="contact-form-card__message">
        <Input.TextArea
          placeholder="想对我说的话..."
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={500}
          autoSize={{ minRows: 3, maxRows: 6 }}
          className="contact-form-textarea"
        />
      </div>

      {/* Footer */}
      <div className="contact-form-card__footer">
        {/* <span className="contact-form-counter">{content.length}/500</span> */}
        <Button
          type="primary"
          size="small"
          loading={sending}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          发送邮件
        </Button>
      </div>
    </div>
  )
}
