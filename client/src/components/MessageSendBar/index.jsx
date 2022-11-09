import { useState } from 'react'
import './messageSendBar.css'

export default function MessageSendBar ({ onSubmitMessage }) {
  const [message, setMessage] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()

    const messageObj = {
      message
    }

    onSubmitMessage(messageObj)
    setMessage('')
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  return (
    <form className='form-container' onSubmit={onSubmit}>
      <input
        className='message-input'
        type='text'
        placeholder='Mensaje'
        value={message}
        onChange={handleMessageChange}
      />
      <button>Send</button>
    </form>
  )
}
