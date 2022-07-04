import useRooms from '../../hooks/useRooms'
import { useState } from 'react'

export default function Rooms () {
  const { rooms, addRoom } = useRooms()
  const [name, setName] = useState('')

  const handleRoomNameChange = (event) => {
    setName(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addRoom({ name })
  }
  return (
    <>
      <h1>rooms</h1>
      <ul>
        {
            rooms.map((room) =>
              <li key={room.id}>{room.name}</li>
            )
        }
      </ul>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='roomName'
            placeholder='room name'
            onChange={handleRoomNameChange}
          />
          <button>create</button>
        </form>
      </div>
    </>
  )
}
