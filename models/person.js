const mongoose = require('mongoose')
/*global process*/

mongoose.set('strictQuery', false)

const url = process.env.MONGO_URI

mongoose.connect(url)
  .then(result => console.log('connected'))
  .catch((error) => {
    console.log('error while connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  phone: {
    type: String,
    validate : {
      validator: function (v) {
        return /\d{2,3}-\d+/.test(v)
      },
      message: props => `${props.value} is not a valid phone number.`
    },
    minLength: 8,
    required: true,
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)