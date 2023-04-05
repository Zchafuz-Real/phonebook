require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(express.json())
morgan.token('person', function getP (req) {
  if (req.body.name) {
    return (JSON.stringify(req.body))
  }
  return null
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :person'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, phone } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, phone },
    { new:true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request,response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    }).catch(error => next(error))


})

app.get('/info', (request, response) => {
  response.send(`<div>Phoneobok has info for ${Person.length}</div> <p>${Date()}</p>`)

})

app.post('/api/persons', (request,response,next) => {
  const body = request.body

  const newPerson = {
    id: Math.floor(Math.random() * 100),
    name: body.name,
    phone: body.phone
  }


  const person = new Person(newPerson)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request,response,next) => {

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.log('ERROR:********', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error:error.message })
  }
  if (error.name === 'ReferenceError') {
    return response.status(400).json({ error:error.message })
  }
  next(error)


}


app.use(errorHandler)


/*global process*/
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})