const mongoose = require('mongoose')
const { server } = require('../index')
const User = require('../models/User')

const {
  initialUsers,
  api,
  getAllUsers,
  saveInitialUsers
} = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})
  await saveInitialUsers()
})

describe('GET / getting', () => {
  test('all users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialUsers.length)
  })

  test('a user when the id is valid', async () => {
    const usersDB = await getAllUsers()
    const firstUser = usersDB[0]

    const id = firstUser.id
    const userName = firstUser.userName
    const name = firstUser.name

    const response = await api
      .get(`/api/users/${id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.userName).toBe(userName)
    expect(response.body.name).toBe(name)
  })

  test('an error when the id is not valid', async () => {
    const invalidId = mongoose.Types.ObjectId('62a84d69e70f7d09cb06e25b')

    await api
      .get(`/api/users/${invalidId}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST / a new User', () => {
  test('is created when it is valid', async () => {
    const newUser = {
      userName: 'newUser',
      name: 'name',
      password: '123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersDB = await getAllUsers()
    expect(usersDB).toHaveLength(initialUsers.length + 1)
    expect(usersDB.map(user => user.userName)).toContain(newUser.userName)
  })

  test('is created with a crypted password', async () => {
    const newUser = {
      userName: 'newUser',
      name: 'name',
      password: '123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersDB = await getAllUsers()
    expect(usersDB).toHaveLength(initialUsers.length + 1)
    expect(usersDB.map(user => user.userName)).toContain(newUser.userName)

    const userDB = await User.find({ userName: newUser.userName })
    expect(userDB[0].password).not.toBe(newUser.password)
  })

  test('is not created without the userName field', async () => {
    const newInvalidUser = {
      name: 'name',
      password: '123'
    }

    await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersDB = await getAllUsers()
    expect(usersDB).toHaveLength(initialUsers.length)
  })

  test('is not created without the name field', async () => {
    const newInvalidUser = {
      userName: 'name',
      password: '123'
    }

    const response = await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersDB = await getAllUsers()
    expect(usersDB).toHaveLength(initialUsers.length)
    console.log(response.body.errors)
  })

  test('is not created without the password field', async () => {
    const newInvalidUser = {
      userName: 'newUser',
      name: 'name'
    }

    await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersDB = await getAllUsers()

    expect(usersDB).toHaveLength(initialUsers.length)
  })
  test('is not created when the userName is invalid', async () => {
    const newInvalidUser = {
      userName: 'invalid user',
      name: 'name',
      password: 'pass'
    }

    await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const userDB = await getAllUsers()
    expect(userDB).toHaveLength(initialUsers.length)
  })

  test('is not created when the user is already created', async () => {
    const newInvalidUser = {
      userName: initialUsers[0].userName,
      name: initialUsers[0].name,

      password: '123'
    }

    await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)

    const userDB = await getAllUsers()
    expect(userDB).toHaveLength(initialUsers.length)
  })
})

describe('DELETE / deleting users ', () => {
  test('when exists in the database', async () => {
    const response = await getAllUsers()
    const userToDelete = response[0]

    await api
      .delete(`/api/users/${userToDelete.id}`)
      .expect(204)

    const usersDB = await getAllUsers()
    expect(usersDB).toHaveLength(initialUsers.length - 1)
    expect(usersDB.map(user => user.userName)).not.toContain(userToDelete)
  })

  test('does not delete when the user does not exist in the database', async () => {
    await api
      .delete('/api/users/123')
      .expect(400)

    const usersDB = await getAllUsers()
    expect(usersDB).toHaveLength(initialUsers.length)
  })
})

describe('PUT / Upgrading a users ', () => {
  test('when the password is changed', async () => {
    const usersDB = await getAllUsers()
    const userToUpdate = usersDB[0]

    const userName = userToUpdate.userName

    const newUser = {
      newPassword: 'newPassword'
    }

    const oldUserDB = await User.find({ userName })
    const oldPassword = oldUserDB[0].password

    await api
      .put(`/api/users/${userToUpdate.id}/changePassword`)
      .send(newUser)
      .expect(200)

    const userDB = await User.find({ userName })
    expect(userDB[0].password).not.toBe(oldPassword)
  })

  test('when the name is changed', async () => {
    const usersDB = await getAllUsers()
    const userToUpdate = usersDB[0]

    const userName = userToUpdate.userName

    const updatedFields = {
      newName: 'newName'
    }

    const oldUserDB = await User.find({ userName })
    const oldName = oldUserDB[0].name

    await api
      .put(`/api/users/${userToUpdate.id}/changeName`)
      .send(updatedFields)
      .expect(200)

    const userDB = await User.find({ userName })
    expect(userDB[0].name).not.toBe(oldName)
  })
})

afterAll(() => {
  mongoose.disconnect()
  server.close()
})
