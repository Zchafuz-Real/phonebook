require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

morgan.token('person', function getP (req) {
    if (req.body.name) {
        return (JSON.stringify(req.body))
    }
    return null
})
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :person'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})
app.get('/api/persons/:id', (request,response)=>{

    Person.findById(request.params.id)
    .then(person => response.json(person))
    
})


app.get('/info', (request, response) => {
    response.send(`<div>Phoneobok has info for ${persons.length}</div> <p>${Date()}</p>`)

})

app.post('/api/persons', (request,response) => {
    const body = request.body

    const newPerson = {
        id: Math.floor(Math.random() * 100),
        name: body.name,
        phone: body.phone
    }
    
    if (!body.name || !body.phone) {
        response.json({error: 'name or number is missing'})
        return response.status(400).end()
    }
    else if (persons.some(p => p.name === body.name)) {
        response.json({error: `${body.name} already in the phonebook`})
        return response.status(400).end()
    }

    
    const person = new Person(newPerson)

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    //persons = persons.concat(newPerson)
    //response.json(newPerson)

})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)

    persons = persons.filter(p => p.id !== id)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})