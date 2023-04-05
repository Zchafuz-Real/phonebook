const mongoose = require('mongoose')
/*global process*/
if (process.argv.length < 3) {
  console.log('requires password')
  process.exit(1)
}


const password = process.argv[2]
const url = `mongodb+srv://s220257:${password}@cluster0.ltoxv9x.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  phone: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: `${name}`,
    phone: `${number}`
  })

  person.save().then(result => {
    console.log('person saved')
    mongoose.connection.close()
  })
}

else {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => console.log(`${p.name} ${p.phone}`))
    mongoose.connection.close()
  })
}





