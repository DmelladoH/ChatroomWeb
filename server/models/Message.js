const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const messageSchema = new Schema({
  message: {
    type: String,
    required: [true, 'message required']
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'sender required']
  }
},
{
  timestamps: true
}
)

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

messageSchema.plugin(uniqueValidator)
const menssage = model('Message', messageSchema)

module.exports = menssage
