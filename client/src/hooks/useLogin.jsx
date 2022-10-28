import { useCallback, useContext } from 'react'

import Context from '../context/UserContextProvider'
import loginService from '../server/loginService'

function useLogin () {
  const { jwt, setJwt, userId, setUserId } = useContext(Context)

  const login = useCallback(({ userName, password }) => {
    loginService({ userName, password })
      .then(data => {
        const jwt = data.token
        const id = data.id
        setUserId(id)

        window.sessionStorage.setItem('jwt', jwt)
        window.sessionStorage.setItem('user', id)
        setJwt(jwt)
      }).catch(error => {
        window.sessionStorage.removeItem('jwt')
        console.error(error)
      })
  }, [setJwt, setUserId])

  const logout = useCallback(() => {
    window.sessionStorage.removeItem('jwt')
    setJwt(null)
  }, [setJwt])

  return { login, logout, userId, isLogged: Boolean(jwt) }
}

export default useLogin
