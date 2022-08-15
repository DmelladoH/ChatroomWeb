
import { useNavigate, useLocation } from 'react-router'
import { useEffect } from 'react'

import useLogin from '../../hooks/useLogin'
import LoginForm from '../../components/LoginForm'

import styles from './login.module.css'

function Login () {
  const { login, isLogged } = useLogin()
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
    <div className={styles.container}>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  )
}

export default Login
