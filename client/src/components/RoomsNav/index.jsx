import useRooms from '../../hooks/useRooms'

import styles from './Rooms.module.css'
import CreateRoomForm from './CreateRoomForm'

export default function RoomsNav () {
  const { rooms, addRoom } = useRooms()

  const handleSubmit = (name) => {
    addRoom({ name })
  }

  return (
    <div className={styles.sideMenu}>
      <h1 className={styles.title}>rooms</h1>
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
    </div>
  )
}
