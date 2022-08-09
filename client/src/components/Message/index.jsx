import './message.css'
import useUser from '../../hooks/useUser'

export default function Message ({ sender, message }) {
  console.log({ sender, message })
  const { user } = useUser({ id: sender })
  console.log({ user })

  return (
    <div className='message-container'>
      <div>
        <h4>{user.name}</h4>
      </div>
      <div>
        <p>{message}</p>
      </div>
    </div>
  )
}
