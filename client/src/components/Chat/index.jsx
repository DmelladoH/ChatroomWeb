import MessageSendBar from '../MessageSendBar'
import useMessage from '../../hooks/useMessage'
import Message from '../Message'
// import WelcomeMessage from '../WelcomeMessage'

import './Chat.css'

export default function Chat ({ room }) {
  const { postMessage, messages } = useMessage({ room })

  const sendMessage = (message) => {
    postMessage(message)
  }
  console.log(messages)
  return (
    <div className='chatContainer'>
      <div>
        <h3>{room}</h3>
      </div>
      <div>
        <h5>messages</h5>
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
      <div>
        <MessageSendBar onSubmitMessage={sendMessage} />
      </div>
    </div>
  )
}
