const mongoose = require('mongoose')
const { server } = require('../index')

beforeEach(async () => {

})

describe('GET / getting', () => {
  test('all messages of a room when the user is authorized', async () => {})

  test('an error when the user is not subscribed to the room', async () => {})

  test('an error when no authorized user', async () => {})

  test('an error when the room id is invalid', async () => {})
})

describe('POST / post', () => {
  test('post a message to a room when the user is authorized', async () => {})

  test('the messages with page breaks are saved properly', async () => {})

  test('the messages with special chacacters are saved properly (", \', \\)', async () => {})

  test('an error when the user is not subscribed to the room', async () => {})

  test('an error when the message body is empty', async () => {})

  test('an error when there is no message body', async () => {})

  test('an error when no authorized user', async () => {})
})

afterAll(() => {
  mongoose.disconnect()
  server.close()
})
