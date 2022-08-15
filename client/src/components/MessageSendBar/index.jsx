import { useState } from 'react'

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
    <div>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          placeholder='Mensaje'
          value={message}
          onChange={handleMessageChange}
        />
        <button>Send</button>
      </form>
    </div>
  )
}
