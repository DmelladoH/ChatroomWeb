const { api, initialUsers, saveInitialUsers } = require('./helpers')
const mongoose = require('mongoose')
const { server } = require('../index')
const User = require('../models/User')

beforeEach(async () => {
  await User.deleteMany({})
  await saveInitialUsers()
})

describe('Login', () => {
  test('an existing user can log in and a token is generated', async () => {
    const firstUser = initialUsers[0]
    const userAccess = {
      userName: firstUser.userName,
      password: firstUser.password
    }

    const response = await api
      .post('/api/login')
      .send(userAccess)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).not.toBe(undefined)
  })

  test('a no existing user cannot log in and a token is not generated', async () => {
    const userAccess = {
      userName: 'NoExistingUserName',
      password: 'password'
    }

    const response = await api
      .post('/api/login')
      .send(userAccess)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBe(undefined)
  })

  test('an existing user with an incorrect password cannot log in and a token is not generated', async () => {
    const firstUser = initialUsers[0]

    const userAccess = {
      userName: firstUser.userName,
      password: 'password'
    }

    const response = await api
      .post('/api/login')
      .send(userAccess)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBe(undefined)
  })

  afterAll(() => {
    mongoose.disconnect()
    server.close()
  })
})
