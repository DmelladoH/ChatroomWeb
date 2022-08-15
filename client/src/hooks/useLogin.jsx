import { useCallback, useContext } from 'react'

import Context from '../context/UserContextProvider'
import loginService from '../server/loginService'

function useLogin () {
  const { jwt, setJwt, user, setUser } = useContext(Context)

  const login = useCallback(({ userName, password }) => {
    loginService({ userName, password })
      .then(data => {
        const jwt = data.token
        const id = data.id

        console.log(id)
        setUser(id)

        window.sessionStorage.setItem('jwt', jwt)
        window.sessionStorage.setItem('user', id)
        setJwt(jwt)
      }).catch(error => {
        window.sessionStorage.removeItem('jwt')
        console.error(error)
      })
  }, [setJwt, setUser])

  const logout = useCallback(() => {
    window.sessionStorage.removeItem('jwt')
    setJwt(null)
  }, [setJwt])

  return { login, logout, user, isLogged: Boolean(jwt) }
}

export default useLogin
