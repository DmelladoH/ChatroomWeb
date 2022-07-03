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

const getRooms = () => {
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const getUsersRooms = () => {
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const subscribe = async (roomId) => {
  const request = axios.post(baseUrl + 'roomId' + '/subscribe', config)
  return request.then(response => response.data)
}

const createRoom = async (newObject) => {
  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

export default { getUsersRooms, createRoom, getRooms, subscribe, setToken }
