import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginForm ({ onSubmit }) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (event) => {
    setUserName(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const hundleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ userName, password })
  }
  return (
    <>
      <div>
        <form onSubmit={hundleSubmit}>
          <div>
            <h1>Login</h1>
          </div>
          <div>
            <label>
              username:
              <input
                type='text'
                placeholder='username'
                name='username'
                onChange={handleUsernameChange}
              />
            </label>
          </div>
          <div>
            <label>
              password:
              <input
                type='password'
                placeholder='password'
                name='password'
                onChange={handlePasswordChange}
              />
            </label>
          </div>
          <button>log in</button>
          <div>
            <span><Link to='/register'>Create account</Link></span>
          </div>
        </form>
      </div>
    </>
  )
}
