require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectionURI = process.env.MONGO_DB_URI
const environment = process.env.NODE_ENV

const userRouter = require('./controller/userController')
const loginRouter = require('./controller/loginController')
const roomRouter = require('./controller/roomController')

const handleError = require('./middleware/handleError')
const notFound = require('./middleware/notFound')

const User = require('./models/User')
// const Room = require('./models/Room')

const app = express()

const { databaseConnection, databaseDisconnection } = require('./mongo')

app.use(express.json())
app.use(cors())

databaseConnection(connectionURI, environment)

app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/rooms', roomRouter)

app.use(handleError)
app.use(notFound)

process.on('uncaughtException', (err) => {
  console.log('uncaught exception: ', err)
  databaseDisconnection()
})

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  socket.on('join', ({ user, room }) => {
    console.log('user joined to ', room)
    socket.join(room)

    socket.emit('message', { user, text: `Welcome ${user} to ${room}` })
    socket.broadcast.to(room).emit('message', { user, text: ` ${user} joined ${room}` })
  })

  socket.on('sendMessage', async ({ message, room, user }) => {
    console.log({ message })
    console.log({ room })
    console.log({ user })
    const userdb = await User.findById(user)
    console.log({ userdb })

    io.to(room).emit('message', { user, text: message })
  })
})

module.exports = { app, server }
