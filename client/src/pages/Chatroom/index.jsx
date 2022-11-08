import Chat from '../../components/Chat'
import {
  useParams
} from 'react-router-dom'
function Chatroom ({ params }) {
  const { room } = useParams()
  return (
    <>
      <Chat room={room} />
    </>
  )
}

export default Chatroom
