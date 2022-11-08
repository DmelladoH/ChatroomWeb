import Message from '../Message'
import './MessageList.css'

export default function MessageList ({ messages }) {
  return (
    <div className='messages-container'>
      <ul>
        {
          messages.map((msg) =>
            <Message
              key={msg.id}
              sender={msg.sender}
              message={msg.message}
            />
          )
        }
      </ul>
    </div>
  )
}
