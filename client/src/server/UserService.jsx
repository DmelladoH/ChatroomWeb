import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/users'

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

const createAccount = async (userData) => {
  const { data } = await axios.post(baseUrl, userData)
  return data
}

const getUser = async (id) => {
  const { data } = await axios.get(`${baseUrl}/${id}`, config)
  return data
}

export default { createAccount, getUser, setToken }
