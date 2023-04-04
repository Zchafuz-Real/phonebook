const mongoose = require('mongoose')


mongoose.set('strictQuery', false)

const url = process.env.MONGO_URI
console.log('connecting to: ', url)

mongoose.connect(url)
.then(result => console.log('connected'))
.catch((error) => {
    console.log('error while connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    phone: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)