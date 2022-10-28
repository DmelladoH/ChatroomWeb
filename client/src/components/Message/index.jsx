import './message.css'
import { useContext } from 'react'

import useUser from '../../hooks/useUser'
import Context from '../../context/UserContextProvider'

export default function Message ({ sender, message }) {
  const { user } = useUser({ id: sender })
  const { userId } = useContext(Context)

  const yourMessage = user.id === userId

  return (
    <div className={`message-container ${yourMessage ? 'yourMessage' : 'othersMessage'}`}>
      {
        !yourMessage
          ? (
            <div className='messageTitle'>
              <h4>{user.name}</h4>
            </div>
            )
          : ' '
      }
      <div className='messageBody'>
        <p>{message}</p>
      </div>
    </div>
  )
}
