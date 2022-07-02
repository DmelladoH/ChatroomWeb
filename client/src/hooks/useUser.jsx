import { useCallback, useContext } from 'react'
import Context from '../context/UserContextProvider'
import loginService from '../server/loginService'

function useUser () {
  const { jwt, setJwt } = useContext(Context)

  const login = useCallback(({ userName, password }) => {
    loginService({ userName, password })
      .then(data => {
        const jwt = data.token

        window.sessionStorage.setItem('jwt', jwt)
        setJwt(jwt)
      }).catch(error => {
        window.sessionStorage.removeItem('jwt')
        console.error(error)
      })
  }, [setJwt])

  const logout = useCallback(() => {
    window.sessionStorage.removeItem('jwt')
    setJwt(null)
  }, [setJwt])

  return { login, logout, isLogged: Boolean(jwt) }
}

export default useUser
