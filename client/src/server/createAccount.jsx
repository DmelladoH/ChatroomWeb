import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/users'

const createAccountService = async (userData) => {
  const { data } = await axios.post(baseUrl, userData)
  return data
}

export default createAccountService
