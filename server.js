require('dotenv').config()
const express = require('express')
const db = require('./db')
const app = express()
const passport = require('./auth')
const bodyParser = require('body-parser')
app.use(express.json())
// app.use(bodyParser.json())
const PORT= process.env.PORT || 3000


app.use(passport.initialize()) 
// now we have to decide where we have to use our authentication

const localauthMiddleware = passport.authenticate('local',{session:false})

// Import the usersRoutes

const usersRoutes = require('./routes/users.routes.js')

// import the candidatesRoutes
const candidatesRoutes = require('./routes/candidates.routes.js')


const { MongooseError } = require('mongoose')

// use the personRoutes 

app.use('/users',usersRoutes)

// use the candidatesRoutes
app.use('/candidates',candidatesRoutes)
app.listen(PORT,()=>{
    console.log("Server started successfully ")
})