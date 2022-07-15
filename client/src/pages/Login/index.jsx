
import { useNavigate, useLocation } from 'react-router'
import { useEffect } from 'react'

import useUser from '../../hooks/useUser'
import LoginForm from '../../components/LoginForm'
function Login () {
  const { login, isLogged } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  const validateForm = ({ userName, password }) => {
    if (userName === '') {
      console.log('name is required')
      return false
    }

    if (password === '') {
      console.log('password is required')
      return false
    }

    return true
  }

  useEffect(() => {
    if (isLogged) {
      if (location.state?.from) {
        navigate(location.state.from)
      } else {
        navigate('/')
      }
    }
  }, [isLogged, navigate])

  const handleSubmit = ({ userName, password }) => {
    if (validateForm({ userName, password })) {
      login({ userName, password })
    }
  }

  return (
    <>
      <LoginForm onSubmit={handleSubmit} />
    </>
  )
}

export default Login
