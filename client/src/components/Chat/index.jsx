import { useState, useEffect } from 'react'

import MessageSendBar from '../MessageSendBar'
import useMessage from '../../hooks/useMessage'
import useRooms from '../../hooks/useRooms'

import './Chat.css'
import MessageList from '../MessageList'

export default function Chat ({ room }) {
  const { postMessage, messages } = useMessage({ room })
  const [roomName, setRoomName] = useState('')

  const { getRoom } = useRooms()

  useEffect(() => {
    getRoom(room).then(
      room => setRoomName(room.name)
    )
  }, [room])

  const sendMessage = (message) => {
    postMessage(message)
  }

  return (
    <div className='chat-container'>
      <div className='chat-header'>
        <h3>{roomName}</h3>
      </div>
      <div className='chat-body'>
        <MessageList messages={messages} />
      </div>
      <footer className='footer-container'>
        <MessageSendBar onSubmitMessage={sendMessage} />
      </footer>
    </div>
  )
}
