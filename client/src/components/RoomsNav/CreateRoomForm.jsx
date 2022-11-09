import { useState } from 'react'
import styles from './CreateRoomForm.module.css'

export default function CreateRoomForm ({ handleSubmit }) {
  const [name, setName] = useState('')

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    handleSubmit(name)
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          className={styles.input}
          type='text'
          name='roomName'
          placeholder='room name'
          value={name}
          onChange={handleNameChange}
        />
        <button className={styles.btn}>create</button>
      </form>
    </>
  )
}
