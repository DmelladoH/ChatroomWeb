const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const mongoose = require('mongoose')

const User = require('../models/User')
const Room = require('../models/Room')

const ConflictError = require('../Errors/ConflictError')
const NotFoundError = require('../Errors/NotFoundError')
const userExtractor = require('../middleware/userExtractor')

userRouter.get('/', async (request, response) => {
  const user = await User.find({})
  response.json(user)
})

userRouter.post('/', async (request, response, next) => {
  const body = request.body
  const saltRounds = 10
  let passwordHash = null

  try {
    const user = await User.findOne({ userName: body.userName })

    if (user !== null) {
      return next(new ConflictError('userName already exits'))
    }

    if (body.password) { passwordHash = await bcrypt.hash(body.password, saltRounds) }
    const newUser = new User({
      userName: body.userName,
      name: body.name,
      password: passwordHash
    })

    const savedUser = await newUser.save()
    response.status(201)
    response.json(savedUser)
  } catch (err) {
    next(err)
  }
})

userRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const user = await User.findById(id)

    if (user === null) { return next(new NotFoundError('user not found')) }

    const userResponse = {
      id: user.id,
      name: user.name,
      userName: user.userName,
      room: user.rooms
    }

    response.json(userResponse)
  } catch (err) {
    next(err)
  }
})

userRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    await User.findByIdAndDelete(id)
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

userRouter.get('/room/subscribed', userExtractor, async (request, response, next) => {
  const { userId } = request

  const user = await User.findById(userId)

  const roomsId = user.rooms
  // const rooms = []

  const promeses = roomsId.map(async id => {
    const room = await Room.findById(id)
    console.log(room)
    return room
  })

  const rooms = await Promise.all(promeses)
  console.log({ rooms })
  response.status(200)
  response.json(rooms)
})

userRouter.put('/changePassword', userExtractor, async (request, response, next) => {
  const { userId } = request
  const mid = mongoose.Types.ObjectId(userId)

  try {
    const newPasswordHash = await bcrypt.hash(request.body.newPassword, 10)
    const user = await User.findByIdAndUpdate({ _id: mid }, { password: newPasswordHash })
    return response.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

userRouter.put('/changeName', userExtractor, async (request, response, next) => {
  const { userId } = request
  const mid = mongoose.Types.ObjectId(userId)

  try {
    const user = await User.findByIdAndUpdate({ _id: mid }, { name: request.body.newName })
    return response.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

module.exports = userRouter
