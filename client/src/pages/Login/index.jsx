import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router'

import useUser from '../../hooks/useUser'

function Login () {
  const { login, isLogged } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const validateForm = () => {
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

  const handleUsernameChange = (event) => {
    setUserName(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (validateForm()) {
      login({ userName, password })
    }

    if (isLogged) {
      if (location.state?.from) {
        navigate(location.state.from)
      } else {
        navigate('/')
      }
    }
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <h1>Login</h1>
          </div>
          <label>
            username:
            <input
              type='text'
              placeholder='username'
              name='username'
              onChange={handleUsernameChange}
            />
          </label>
          <label>
            password:
            <input
              type='password'
              placeholder='password'
              name='password'
              onChange={handlePasswordChange}
            />
          </label>
          <button>log in</button>
          <span><Link to='/register'>Create account</Link></span>
        </form>
      </div>
    </>
  )
}

export default Login
