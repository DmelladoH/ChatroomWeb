import '../Message/message.css'

export default async function WelcomeMessage ({ message }) {
  return (
    <div className='message-container'>
      <div>
        <p>{message}</p>
      </div>
    </div>
  )
}
