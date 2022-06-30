const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    match: [/^[a-zA-Z0-9]+$/, 'userName invalid'],
    required: [true, 'userName required']

  },
  name: {
    type: String,
    required: [true, 'name required']
  },
  password: {
    type: String,
    required: [true, 'password required']
  },
  rooms: [{
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject.__v
    delete returnedObject._id
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)
const User = model('User', userSchema)

module.exports = User
