import { useState } from 'react'

export default function CreateRoomForm ({ handleSubmit }) {
  const [name, setName] = useState('')

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    handleSubmit(name)
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          name='roomName'
          placeholder='room name'
          value={name}
          onChange={handleNameChange}
        />
        <button>create</button>
      </form>
    </>
  )
}
