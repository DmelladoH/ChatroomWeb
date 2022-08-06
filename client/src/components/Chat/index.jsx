import { useEffect } from 'react'

import MessageSendBar from '../MessageSendBar'
import useMessage from '../../hooks/useMessage'

import './Chat.css'

export default function Chat ({ room }) {
  const { postMessage, messages } = useMessage({ room })

  const sendMessage = (message) => {
    postMessage(message)
  }

  return (
    <div className='chatContainer'>
      <div>
        <h3>{room}</h3>
      </div>
      <div>
        {
          messages.map(msg => {
            <p key={msg}>{msg.user}:{msg.text}</p>
          })
        }
      </div>
      <div>
        <MessageSendBar onSubmitMessage={sendMessage} />
      </div>
    </div>
  )
}
