import { useState } from 'react'

import createAccount from '../../server/createAccount'
import RegistrationForm from '../../components/RegistrationForm'

function register () {
  const [register, setRegister] = useState(false)

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
      createAccount({ name, userName, password })
        .then(setRegister(true))
    }
  }

  if (register) {
    return <h1>account created</h1>
  }

  return (
    <>
      <RegistrationForm onSubmit={handleSubmit} />
    </>
  )
}

export default register
