const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')
const Room = require('../models/Room')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const api = supertest(app)

const initialUsers = [
  {
    userName: 'testUser',
    name: 'test',
    password: '123'
  },
  {
    userName: 'anotherTestUser',
    name: 'anotherTest',
    password: '123'
  }
]

const initialRooms = [
  {
    name: 'firstRoom',
    users: []
  },
  {
    name: 'sencondRoom',
    users: []
  }
]

const saveInitialUsers = async () => {
  for (const user of initialUsers) {
    const userDb = {
      userName: user.userName,
      name: user.name,
      password: await bcrypt.hash(user.password, 10)
    }
    const userObj = new User(userDb)

    await userObj.save()
  }
}

const generateTempToken = (infoToken) => {
  return jwt.sign(infoToken, process.env.SECRET, {
    expiresIn: 60
  })
}

const getAllUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

const getAllRooms = async () => {
  const roomDB = await Room.find({})
  return roomDB.map(room => room.toJSON())
}

const getUser = async (id) => {
  const mid = mongoose.Types.ObjectId(id)
  const userDB = await User.find({ _id: mid })
  return userDB.map(user => user.toJSON())[0]
}

const getRoom = async (id) => {
  const mid = mongoose.Types.ObjectId(id)
  const roomDB = await Room.find({ _id: mid })
  return roomDB.map(room => room.toJSON())[0]
}

module.exports = { api, initialUsers, initialRooms, saveInitialUsers, getAllUsers, getAllRooms, getUser, getRoom, generateTempToken }
