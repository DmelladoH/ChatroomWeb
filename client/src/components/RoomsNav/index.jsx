import useRooms from '../../hooks/useRooms'

import './Rooms.css'
import CreateRoomForm from './CreateRoomForm'

export default function RoomsNav () {
  const { rooms, addRoom } = useRooms()

  const handleSubmit = (name) => {
    addRoom({ name })
  }

  return (
    <nav>
      <h1>rooms</h1>
      <ul>
        {
          rooms.map((room) =>
            <li key={room.id}><a href={room.id}>{room.name}</a></li>
          )
        }
      </ul>
      <div>
        <CreateRoomForm handleSubmit={handleSubmit} />
      </div>
    </nav>
  )
}
