import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function RegistrationForm ({ onSubmit }) {
  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleNameChange = (event) => {
    setName(event.target.value)
  }
  const handleUsernameChange = (event) => {
    setUserName(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({ name, userName, password })
  }

  return (
    <>
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
    </>
  )
}
