import { useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './loginForm.module.css'

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
      <div className={styles.container}>
        <form onSubmit={hundleSubmit}>
          <div>
            <h1>Login</h1>
          </div>
          <div>
            <input
              className={styles.authInput}
              type='text'
              placeholder='username'
              name='username'
              onChange={handleUsernameChange}
            />

          </div>
          <div>
            <input
              className={styles.authInput}
              type='password'
              placeholder='password'
              name='password'
              onChange={handlePasswordChange}
            />

          </div>
          <button className={styles.btn}>log in</button>
          <div className={styles.linkContainer}>
            <span>Don't have an account? <Link className={styles.link} to='/register'>Create</Link></span>
          </div>
        </form>
      </div>
    </>
  )
}
