require('dotenv').config()
const mongoose = require("mongoose")

// Define the mongodb connection url localdatabase connection

const Mongo_URL_LOCAL= process.env.Mongo_URL_LOCAL

// Mongodb atlas connection 
// const Mongo_URL_ONLINE = process.env.Mongo_URL_ONLINE

// setup mongodb server

mongoose.connect(Mongo_URL_LOCAL,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true ,
    // autoReconnect: false, // Prevents automatic reconnection
    // serverSelectionTimeoutMS: 5000, // Timeout if MongoDB is not found   // these are deprecated 
})

// mongoose.connect(Mongo_URL_ONLINE)


// Get the default mongodb connection
// mongoose maintains the default connection object to represent the database

const db = mongoose.connection

// defining events on db here db knows the events and constantly listening the events

db.on('connected',()=>{
    console.log("Database connected successfully")
})

db.on('error',(err)=>{
    console.error("Databse connection failed due to error",err)
})

db.on('disconnected',()=>{
    console.log("Database disconnected")
})

//exports the db object
module.exports=db