import { useGuestbook } from '../hooks/useGuestbook'
import MessageForm from './MessageForm'
import MessageList from './MessageList'

export default function GuestbookSection() {
  const { messages, loading, error, submitting, submitMessage, removeMessage } = useGuestbook()

  return (
    <section
      id="guestbook"
      className="flex min-h-screen flex-col justify-center px-[8vw] pb-0 pt-[100px] max-md:px-[5vw] max-md:py-20"
    >
      <div className="guestbook-inner">
        <div className="guestbook-header">
          <span className="ui-eyebrow">Guestbook</span>
          <h2 className="ui-section-title">留言板</h2>
          <p className="ui-lead-text" style={{ maxWidth: 480, marginTop: 12 }}>
            有什么想说的？留下你的想法，期待与你的交流。
          </p>
        </div>

        <div className="guestboard-body">
          <MessageForm submitting={submitting} onSubmit={payload => submitMessage(payload)} />

          <MessageList
            messages={messages}
            loading={loading}
            error={error}
            submitting={submitting}
            onReply={payload => submitMessage(payload)}
            onDelete={removeMessage}
          />
        </div>
      </div>
    </section>
  )
}
