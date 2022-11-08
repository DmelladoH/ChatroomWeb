import { useState } from 'react'
import { useNavigate } from 'react-router'
import UserService from '../../server/UserService'
import RegistrationForm from '../../components/RegistrationForm'

import styles from './register.module.css'

function register () {
  const [register, setRegister] = useState(false)
  const navigate = useNavigate()

  const validateForm = ({ name, userName, password }) => {
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

  const handleSubmit = ({ name, userName, password }) => {
    if (validateForm({ name, userName, password })) {
      UserService.createAccount({ name, userName, password })
        .then(setRegister(true))
    }
  }

  if (register) {
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <RegistrationForm onSubmit={handleSubmit} />
    </div>
  )
}

export default register
