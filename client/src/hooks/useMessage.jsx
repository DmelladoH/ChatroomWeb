import { useCallback, useState, useContext, useEffect } from 'react'
import Context from '../context/UserContextProvider'
import messageService from '../server/messageService'
// import useUser from '../hooks/useUser'

import socket from '../Utils/Socket'

function useMessage ({ room }) {
  const { jwt, userId } = useContext(Context)
  const [messages, setMessages] = useState([])

  const postMessage = useCallback(({ message }) => {
    console.log('post message')
    console.log({ userId })
    console.log({ room })
    console.log({ message })

    messageService.postMessage({ message }, room)

    // const newMessage = {
    //   message,
    //   room,
    //   sender: userId
    // }
    // setMessages((prevMessages) => [...prevMessages, newMessage])

    socket.emit('sendMessage', { message, room, userId })
  })

  useEffect(() => {
    socket.emit('join', { userId, room })
  }, [])

  useEffect(() => {
    socket.on('message', (socketMessage) => {
      console.log('message recived')
      console.log({ socketMessage })
      setMessages((prevMessages) => [...prevMessages, socketMessage])
    })
    return function cleanup () {
      socket.removeListener('message')
    }
  }, [])

  useEffect(() => {
    messageService.setToken(jwt)
    messageService.getMessages(room)
      .then(menssages =>
        setMessages(menssages))
  }, [])

  return { postMessage, messages }
}

export default useMessage
