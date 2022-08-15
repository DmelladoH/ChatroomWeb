import { useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './registrationForm.module.css'

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
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div>
            <h1>Create</h1>
          </div>
          <div>
            <input
              className={styles.authInput}
              type='text'
              name='name'
              placeholder='name'
              onChange={handleNameChange}
            />
          </div>
          <div>
            <input
              className={styles.authInput}
              type='text'
              name='username'
              placeholder='username'
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            <input
              className={styles.authInput}
              type='password'
              name='password'
              placeholder='password'
              onChange={handlePasswordChange}
            />
          </div>
          <button className={styles.btn}>Create</button>
          <div className={styles.linkContainer}>
            <span>Do you have an account? <Link className={styles.link} to='/login'>log in</Link></span>
          </div>
        </form>
      </div>
    </>
  )
}
