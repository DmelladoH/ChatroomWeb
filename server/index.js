require('dotenv').config()

const connectionURI = process.env.MONGO_DB_URI
const environment = process.env.NODE_ENV

const userRouter = require('./controller/userController')
const loginRouter = require('./controller/loginController')
const roomRouter = require('./controller/roomController')

const handleError = require('./middleware/handleError')
const notFound = require('./middleware/notFound')
const express = require('express')
const cors = require('cors')
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

process.on('uncaughtException', () => {
  databaseDisconnection()
})

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

module.exports = { app, server }
