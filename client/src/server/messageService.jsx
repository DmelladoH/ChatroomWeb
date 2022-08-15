import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/rooms'

let token = null
let config = {
  headers: {
    Authorization: token
  }
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
  config = {
    headers: {
      Authorization: token
    }
  }
}

const getMessages = (roomId) => {
  const request = axios.get(`${baseUrl}/${roomId}/messages`, config)
  console.log(request)
  return request.then(response => response.data)
}

const postMessage = (newObject, roomId) => {
  console.log({ newObject })
  const request = axios.post(`${baseUrl}/${roomId}/messages`, newObject, config)
  return request.then(response => response.data)
}

export default { getMessages, postMessage, setToken }
