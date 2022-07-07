const mongoose = require('mongoose')
const { server } = require('../index')
const bcrypt = require('bcrypt')

const Room = require('../models/Room')
const User = require('../models/User')
const Message = require('../models/Message')

const {
  api,
  initialRooms,
  initialMessages,
  saveInitialUsers,
  getAllRooms,
  getAllUsers,
  getRoom,
  generateTempToken
} = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})
  await Room.deleteMany({})
  await Message.deleteMany({})

  await saveInitialUsers()
  const users = await User.find({})
  const user = users[0]

  for (const room of initialRooms) {
    const roomObj = new Room(room)

    roomObj.users = roomObj.users.concat(user.id)
    user.rooms = user.rooms.concat(roomObj._id)

    await roomObj.save()
    await user.save()
  }

  const rooms = await Room.find({})
  const room = rooms[0]

  for (const message of initialMessages) {
    const messageObj = new Message(message)

    messageObj.room = room.id
    messageObj.sender = user.id

    room.messages = room.messages.concat(messageObj.id)

    await room.save()
    await messageObj.save()
  }
})

describe('GET / getting', () => {
  test('all messages of a room when the user is authorized', async () => {
    const roomDB = await getAllRooms()
    const userDB = await getAllUsers()

    const firstRoom = roomDB[0]
    const firstUser = userDB[0]

    const userForToken = {
      id: firstUser.id,
      userName: firstUser.userName
    }

    const token = generateTempToken(userForToken)

    const response = await api
      .get(`/api/rooms/${firstRoom.id}/messages`)
      .set({ authorization: 'bearer ' + token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log(initialMessages[0])
    expect(response.body).toHaveLength(initialMessages.length)
    expect(response.body[0].message).toBe(initialMessages[0].message)
    expect(response.body[0].room).toBe(firstRoom.id.toString())
    expect(response.body[0].sender).toBe(firstUser.id.toString())
  })

  test('an error when no authorized user', async () => {
    const token = 'invalidToken'

    await api
      .get('/api/rooms')
      .set({ authorization: 'bearer ' + token })
      .expect(401)
  })

  test('an error when the room id is invalid', async () => {
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
      .get(`/api/rooms/${mid}/messages`)
      .set({ authorization: 'bearer ' + token })
      .expect(404)
  })
  test('an error when the user is not subscribed to the room, testCase02', async () => {
    const roomDB = await getAllRooms()
    const userDB = await getAllUsers()

    const firstRoom = roomDB[0]
    const unauthorizedUser = userDB[1]

    const userForToken = {
      id: unauthorizedUser.id,
      userName: unauthorizedUser.userName
    }

    const token = generateTempToken(userForToken)

    await api
      .get(`/api/rooms/${firstRoom.id}/messages`)
      .set({ authorization: 'bearer ' + token })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST / post', () => {
  test('post a message to a room when the user is authorized', async () => {
    const roomsDB = await getAllRooms()
    const usersDB = await getAllUsers()

    const room = roomsDB[0]
    const user = usersDB[0]

    const numberOfMessages = room.messages.length

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    const newMessage = {
      message: 'post message'
    }

    await api
      .post(`/api/rooms/${room.id}/message`)
      .set({ authorization: 'bearer ' + token })
      .send(newMessage)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const roomDB = await getRoom(room.id)
    const msg = roomDB.messages.find(msg => msg.message === newMessage.message)

    expect(msg)
    expect(numberOfMessages).toHaveLength(roomDB.message.length + 1)

    expect(msg.room).toBe(room.id)
    expect(msg.sender).toBe(user.id)
  })

  test('an error when the user is not subscribed to the room', async () => {
    const roomsDB = await getAllRooms()
    const room = roomsDB[0]

    const userDb = {
      userName: 'userNameTest',
      name: 'nameTest',
      password: await bcrypt.hash('pass', 10)
    }
    const userObj = new User(userDb)

    await userObj.save()

    const numberOfMessages = room.messages.length

    const userForToken = {
      id: userObj.id,
      userName: userObj.userName
    }

    const token = generateTempToken(userForToken)

    const newMessage = {
      message: 'post message'
    }

    await api
      .post(`/api/rooms/${room.id}/message`)
      .set({ authorization: 'bearer ' + token })
      .send(newMessage)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const roomDB = await getRoom(room.id)
    expect(numberOfMessages).toHaveLength(roomDB.message.length)
  })

  test('an error when the message body is empty', async () => {
    const roomsDB = await getAllRooms()
    const usersDB = await getAllUsers()

    const room = roomsDB[0]
    const user = usersDB[0]

    const numberOfMessages = room.messages.length

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    const newMessage = {
      message: ''
    }

    await api
      .post(`/api/rooms/${room.id}/message`)
      .set({ authorization: 'bearer ' + token })
      .send(newMessage)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const roomDB = await getRoom(room.id)
    expect(numberOfMessages).toHaveLength(roomDB.message.length)
  })

  test('an error when there is no message body', async () => {
    const roomsDB = await getAllRooms()
    const usersDB = await getAllUsers()

    const room = roomsDB[0]
    const user = usersDB[0]

    const numberOfMessages = room.messages.length

    const userForToken = {
      id: user.id,
      userName: user.userName
    }

    const token = generateTempToken(userForToken)

    const newMessage = {

    }

    await api
      .post(`/api/rooms/${room.id}/message`)
      .set({ authorization: 'bearer ' + token })
      .send(newMessage)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const roomDB = await getRoom(room.id)
    expect(numberOfMessages).toHaveLength(roomDB.message.length)
  })

  test('an error when no authorized user', async () => {
    const roomsDB = await getAllRooms()

    const room = roomsDB[0]

    const numberOfMessages = room.messages.length

    const userForToken = {
      id: 'madeUpToken',
      userName: 'madeUpUser'
    }

    const token = generateTempToken(userForToken)

    const newMessage = {
      message: ''
    }

    await api
      .post(`/api/rooms/${room.id}/message`)
      .set({ authorization: 'bearer ' + token })
      .send(newMessage)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const roomDB = await getRoom(room.id)
    expect(numberOfMessages).toHaveLength(roomDB.message.length)
  })
})

afterAll(() => {
  mongoose.disconnect()
  server.close()
})
