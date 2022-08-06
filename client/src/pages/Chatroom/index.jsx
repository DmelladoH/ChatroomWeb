import Chat from '../../components/Chat'
import {
  useParams
} from 'react-router-dom'
function Chatroom ({ params }) {
  const { room } = useParams()
  return (
    <>
      <div>
        <div>
          <Chat room={room} />
        </div>
      </div>
    </>
  )
}

export default Chatroom
