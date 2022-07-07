const mongoose = require('mongoose')
const { server } = require('../index')

const {
  initialUsers,
  api,
  getAllUsers,
  saveInitialUsers,
  initialRooms,
  getAllRooms,
  getRoom,
  getUser,
  generateTempToken
} = require('./helpers')

const Room = require('../models/Room')
const User = require('../models/User')

beforeEach(async () => {
  await User.deleteMany({})
  await Room.deleteMany({})

  await saveInitialUsers()
  // const usersDB = await User.find({})
  const users = await User.find({})
  const user = users[0]

  for (const room of initialRooms) {
    const roomObj = new Room(room)

    roomObj.users = roomObj.users.concat(user.id)
    user.rooms = user.rooms.concat(roomObj.id)

    await roomObj.save()
    await user.save()
  }
})

describe('GET / getting', () => {
  test('all Rooms when the user is authorized', async () => {
    const userDB = await getAllUsers()
    const firstUser = userDB[0]

    const userForToken = {
      id: firstUser.id,
      userName: firstUser.userName
    }

    const token = generateTempToken(userForToken)

    const response = await api
      .get('/api/rooms')
      .set({ authorization: 'bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialRooms.length)
  })
  test('an error when no authorized user', async () => {
    const token = 'invalidToken'

    await api
      .get('/api/rooms')
      .set({ authorization: 'bearer ' + token })
      .expect(401)
  })
  test('a room when the id is valid and the user user is authorized', async () => {
    const roomDB = await getAllRooms()
    const firstRoom = roomDB[0]

    const id = firstRoom.id
    const name = firstRoom.name

    const userDB = await getAllUsers()
    const firstUser = userDB[0]

    const userForToken = {
      id: firstUser.id,
      userName: firstUser.userName
    }

    const token = generateTempToken(userForToken)

    const response = await api
      .get(`/api/rooms/${id}`)
      .expect(200)
      .set({ authorization: 'bearer ' + token })
      .expect('Content-Type', /application\/json/)

    expect(response.body.name).toBe(name)
  })
  test('an error when the id is not valid', async () => {
    const mid = mongoose.Types.ObjectId('62a84d69e70f7d09cb06e25b')

    const rooms = await getAllRooms()
    expect(rooms.map(room => room.id)).not.toContainEqual(mid)

    const userDB = await getAllUsers()
    const firstUser = userDB[0]

    const userForToken = {
      id: firstUser.id,
      userName: firstUser.userName
    }
    const token = generateTempToken(userForToken)

    await api
      .get(`/api/rooms/${mid}`)
      .set({ authorization: 'bearer ' + token })
      .expect(404)
  })
})

describe('POST / CREATE ', () => {
  test('is created when it is correct, the user it is authorized', async () => {
    const { userName } = initialUsers[0]
    const user = await User.findOne({ userName })
    const mid = mongoose.Types.ObjectId(user.id)

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    const newRoom = {
      name: 'newRoom'
    }

    await api
      .post('/api/rooms')
      .set({ authorization: 'bearer ' + token })
      .send(newRoom)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const roomsDB = await getAllRooms()
    expect(roomsDB).toHaveLength(initialRooms.length + 1)
    expect(roomsDB.map(room => room.name)).toContain(newRoom.name)
    const users = roomsDB.filter(room => room.name === newRoom.name)
      .map(room => room.users)[0]

    expect(users).toHaveLength(1)
    expect(users).toContainEqual(mid)
  })
  test('is not created without the name field', async () => {
    const { userName } = initialUsers[0]
    const user = await User.findOne({ userName })

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    const newRoom = {}

    await api
      .post('/api/rooms')
      .set({ authorization: 'bearer ' + token })
      .send(newRoom)
      .expect(400)

    const roomsDB = await getAllRooms()
    expect(roomsDB).toHaveLength(initialRooms.length)
  })
  test('is not created when the name is invalid', async () => {
    const { userName } = initialUsers[0]
    const user = await User.findOne({ userName })

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    const newRoom = {
      name: 'invalid name'
    }

    await api
      .post('/api/rooms')
      .set({ authorization: 'bearer ' + token })
      .send(newRoom)
      .expect(400)

    const roomsDB = await getAllRooms()
    expect(roomsDB).toHaveLength(initialRooms.length)
    expect(roomsDB.map(room => room.name)).not.toContain(newRoom.name)
  })
  test('is not created when a room with the same name is already created', async () => {
    const { userName } = initialUsers[0]
    const user = await User.findOne({ userName })

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    const newRoom = {
      name: initialRooms[0].name
    }

    await api
      .post('/api/rooms')
      .set({ authorization: 'bearer ' + token })
      .send(newRoom)
      .expect(409)

    const roomsDB = await getAllRooms()
    expect(roomsDB).toHaveLength(initialRooms.length)
  })
  test('is not created when the authorization is invalid', async () => {
    const token = 'invalidAuth'

    const newRoom = {
      name: 'newRoom'
    }

    await api
      .post('/api/rooms')
      .set({ authorization: 'bearer ' + token })
      .send(newRoom)
      .expect(401)

    const roomsDB = await getAllRooms()
    expect(roomsDB).toHaveLength(initialRooms.length)
    expect(roomsDB.map(room => room.name)).not.toContain(newRoom.name)
  })
})

describe('POST / subscribe ', () => {
  test('an authorized user can subscribe to a room', async () => {
    const { userName } = initialUsers[1]
    const user = await User.findOne({ userName })
    const mid = mongoose.Types.ObjectId(user.id)
    const subscribedRooms = await Room.find({})

    const roomId = subscribedRooms[0].id

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    await api
      .post(`/api/rooms/${roomId}/subscribe`)
      .set({ authorization: 'bearer ' + token })
      .expect(202)
      .expect('Content-Type', /application\/json/)

    const roomsDB = await getAllRooms()
    expect(roomsDB).toHaveLength(initialRooms.length)

    const roomDB = await getRoom(roomId)

    expect(roomDB.users).toHaveLength(2)
    expect(roomDB.users.includes(user.id))

    const userDB = await getUser(user.id)

    expect(userDB.rooms).toHaveLength(1)
    expect(userDB.rooms.includes(mid))
  })

  test('an not authorized user cannot subscribe to a room', async () => {
    const subscribedRooms = await Room.find({})
    const roomId = subscribedRooms[0].id

    const token = 'invalidToken'

    const roomDB = await getRoom(roomId)
    const numberOfUsers = roomDB.users.length

    await api
      .post(`/api/rooms/${roomId}/subscribe`)
      .set({ authorization: 'bearer ' + token })
      .expect(401)

    const roomDBAfterCall = await getRoom(roomId)
    expect(roomDBAfterCall.users).toHaveLength(numberOfUsers)
  })

  test('a user already subscribe cannot subscribe again', async () => {
    const { userName } = initialUsers[0]

    const user = await User.findOne({ userName })
    const mid = mongoose.Types.ObjectId(user.id)

    const subscribedRooms = await Room.find({})

    const roomId = subscribedRooms[0].id

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    await api
      .post(`/api/rooms/${roomId}/subscribe`)
      .set({ authorization: 'bearer ' + token })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const roomDB = await getRoom(mongoose.Types.ObjectId(roomId))
    // expect(roomDB.id).toStrictEqual(roomId)

    expect(roomDB.users).toHaveLength(1)
    expect(roomDB.users.includes(mid))
  })

  test('the room does not exist', async () => {
    const { userName } = initialUsers[0]
    const user = await User.findOne({ userName })
    const invalidId = mongoose.Types.ObjectId('62a84d69e70f7d09cb06e25b')

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    await api
      .post(`/api/rooms/${invalidId}/subscribe`)
      .set({ authorization: 'bearer ' + token })
      .expect(404)

    const roomsDB = await getAllRooms()

    expect(roomsDB).toHaveLength(initialRooms.length)
  })
})

describe.skip('DELETE', () => {
  test('when exists in the database and the user is authorized', async () => {})
  test('does not delete when exists in the database and the user is not authorized', async () => {})
  test('does not delete when the room does not exist in the database', async () => {})
})

describe.skip('PUT', () => {
  test('an authorized user can update the name of the room', async () => {})
  test('an not authorized user cannot update the name of the room', async () => {})
})

afterAll(() => {
  mongoose.disconnect()
  server.close()
})
