import { useState } from 'react'
import { Link } from 'react-router-dom'

import createAccount from '../../server/createAccount'

function register () {
  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [register, setRegister] = useState(false)

  const handleNameChange = (event) => {
    setName(event.target.value)
  }
  const handleUsernameChange = (event) => {
    setUserName(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const validateForm = () => {
    if (name === '') {
      console.log('name is required')
      return false
    }

    if (userName === '') {
      console.log('userName is required')
      return false
    }

    if (password === '') {
      console.log('password is required')
      return false
    }

    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (validateForm()) {
      createAccount({ name, userName, password })
        .then(setRegister(true))
    }
  }

  if (register) {
    return <h1>account created</h1>
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h1>Create account</h1>
        </div>
        <div>
          <label>
            name:
            <input
              type='text'
              name='name'
              placeholder='name'
              onChange={handleNameChange}
            />
          </label>
        </div>
        <div>
          <label>
            username:
            <input
              type='text'
              name='username'
              placeholder='username'
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            password:
            <input
              type='password'
              name='password'
              placeholder='password'
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button>Create</button>
        <div>
          <span><Link to='/login'>log in</Link></span>
        </div>
      </form>
    </div>
  )
}

export default register
