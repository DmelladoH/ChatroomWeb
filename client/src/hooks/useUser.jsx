import UserService from '../server/UserService'
import Context from '../context/UserContextProvider'

import { useEffect, useState, useContext } from 'react'

function useUser ({ id }) {
  const [user, setUser] = useState({})
  const { jwt } = useContext(Context)

  useEffect(() => {
    UserService.setToken(jwt)
    UserService.getUser(id)
      .then(data => {
        setUser({
          id: data.id,
          name: data.name,
          usename: data.userName,
          rooms: data.room
        })
      })
  }, [id])

  return { user }
}

export default useUser
