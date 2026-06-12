import '../guestbook.css'
import { useGuestbook } from '../hooks/useGuestbook'
import MessageForm from './MessageForm'
import MessageList from './MessageList'

export default function GuestbookSection() {
  const { messages, loading, error, submitting, submitMessage, removeMessage } = useGuestbook()

  return (
    <div className="guestbook-inner">
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
  )
}
