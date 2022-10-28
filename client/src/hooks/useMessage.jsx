import { useCallback, useState, useContext, useEffect } from 'react'
import Context from '../context/UserContextProvider'
import messageService from '../server/messageService'
// import useUser from '../hooks/useUser'

import socket from '../Utils/Socket'

function useMessage ({ room }) {
  const { jwt, user } = useContext(Context)
  const [messages, setMessages] = useState([])

  const postMessage = useCallback(({ message }) => {
    console.log('post message')
    console.log({ user })
    console.log({ message })

    messageService.postMessage({ message }, room)

    socket.emit('sendMessage', { message, room, user })
  })

  // useEffect(() => {
  //   socket.emit('join', { user, room })
  // }, [])

  useEffect(() => {
    socket.on('message', (socketMessage) => {
      setMessages((prevMessages) => [...prevMessages, socketMessage])
    })
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
