import { useCallback, useState, useContext, useEffect } from 'react'
import Context from '../context/UserContextProvider'
import roomsService from '../server/roomsService'

function useRooms () {
  const { jwt } = useContext(Context)
  const [rooms, setRooms] = useState([])

  const addRoom = useCallback(({ name }) => {
    roomsService.createRoom({ name })
      .then(room => setRooms(rooms.concat(room)))
  })

  const getRoom = (roomId) => {
    return roomsService.getRoom(roomId)
  }
  const subscribe = useCallback(({ id }) => {
    roomsService.subscribe(id)
  })

  useEffect(() => {
    roomsService.setToken(jwt)
    roomsService.getUsersRooms()
      .then(rooms =>
        setRooms(rooms))
  }, [jwt])

  return { rooms, getRoom, addRoom, subscribe }
}

export default useRooms
