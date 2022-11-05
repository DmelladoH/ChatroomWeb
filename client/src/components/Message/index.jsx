import './message.css'
import { useContext } from 'react'

import useUser from '../../hooks/useUser'
import Context from '../../context/UserContextProvider'

export default function Message ({ sender, message }) {
  const { user } = useUser({ id: sender })
  const { userId } = useContext(Context)

  const isSentByCurrentUser = user.id === userId

  return (

    isSentByCurrentUser
      ? (
        <div className='your-message-container'>
          <div className='your-message'>
            <div className='message-body'>
              <p>{message}</p>
            </div>
          </div>
        </div>
        )
      : (
        <div className='other-message-container'>
          <div className='other-message'>
            <div className='message-title'>
              <h4>{user.name}</h4>
            </div>
            <div className='message-body'>
              <p>{message}</p>
            </div>
          </div>
        </div>
        )
  )
}
