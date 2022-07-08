const userExtractor = require('../middleware/userExtractor')
const roomRouter = require('express').Router()
const mongoose = require('mongoose')

const Room = require('../models/Room')
const User = require('../models/User')
const Message = require('../models/Message')

const ConflictError = require('../Errors/ConflictError')
const NotFoundError = require('../Errors/NotFoundError')
const BadRequestError = require('../Errors/BadRequestError')
const UnauthorizedError = require('../Errors/UnauthorizedError')

roomRouter.get('/', userExtractor, async (request, response, next) => {
  try {
    const rooms = await Room.find({})
    response.json(rooms)
  } catch (err) {
    next(err)
  }
})

roomRouter.get('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params

  try {
    const room = await Room.findById(id)

    if (room === null) { return next(new NotFoundError('user not found')) }

    response.json(room)
  } catch (err) {
    next(err)
  }
})

roomRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const body = request.body
    const { userId } = request

    const user = await User.findById(userId)
    const room = await Room.findOne({ name: body.name })

    if (room !== null) {
      return next(new ConflictError('userName already exits'))
    }

    const newRoom = new Room({
      name: body.name,
      users: [userId]
    })

    const savedRoom = await newRoom.save()

    user.rooms = user.rooms.concat(savedRoom._id)
    await user.save()
    response.status(201)
    response.json(savedRoom)
  } catch (err) {
    next(err)
  }
})

roomRouter.post('/:id/subscribe', userExtractor, async (request, response, next) => {
  const roomId = request.params.id
  const { userId } = request

  const user = await User.findById(userId)
  const room = await Room.findById(roomId)

  if (room === null) {
    return next(new NotFoundError('Room not founded'))
  }

  if (room.users.includes(mongoose.Types.ObjectId(userId))) {
    return next(new BadRequestError('the user it is already subscribed to this room'))
  }

  room.users = room.users.concat(userId)
  await room.save()

  user.rooms = user.rooms.concat(roomId)
  await user.save()

  response.status(202)
  response.json({ success: 'subscribed to a room' })
})

roomRouter.post('/:id/messages', userExtractor, async (request, response, next) => {
  try {
    const roomId = request.params.id
    const { userId } = request
    const { message } = request.body

    const room = await Room.findById(roomId)

    if (room === null) { return next(new NotFoundError('user not found')) }

    if (!room.users.includes(userId)) {
      return next(new UnauthorizedError('user is not subscribed to this room'))
    }

    const newMessage = new Message({
      message,
      room: roomId,
      sender: userId
    })

    const savedMessage = await newMessage.save()
    room.messages = room.messages.concat(savedMessage.id)
    await room.save()

    response.status(201)
    response.json(savedMessage)
  } catch (error) {
    next(error)
  }
})

roomRouter.get('/:id/messages', userExtractor, async (request, response, next) => {
  try {
    const roomId = request.params.id
    const { userId } = request

    const room = await Room.findById(roomId)

    if (room === null) { return next(new NotFoundError('user not found')) }

    if (!room.users.includes(userId)) {
      return next(new UnauthorizedError('user is not subscribed to this room'))
    }

    const promises = room.messages.map(msg => Message.findById(msg))
    const messages = await Promise.all(promises)

    response.status(200)

    response.json(messages)
  } catch (error) {
    next(error)
  }
})

module.exports = roomRouter
