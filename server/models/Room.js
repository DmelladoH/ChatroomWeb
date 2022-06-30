const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const roomSchema = new Schema({
  name: {
    type: String,
    unique: true,
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    required: [true, 'userName required']
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

roomSchema.plugin(uniqueValidator)
const Room = model('Room', roomSchema)

module.exports = Room
