const mongoose = require('mongoose')
const User = require('./users.schema')

const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    party:{
        type:String,
        required:true,
        unique:true
    },  
    // here the vote will look like array of objects in which the userid of user which is in the mongodb 
    // and the votedAt is embeddded in it so it will look loke array of objects 
    // and it is the nested objects we can use in mognoose.schema.types.objectid and reference if the exact name of the model
    // taht we have created in this case user 
    vote:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            },
            votedAt:{
                type:Date,
                default:Date.now()
            }

        }
    ],
    voteCount:{
        type:Number,
        default:0
    },
    age:{
        type:Number,
        
    }

})

const Candidates = mongoose.model('Candidates',candidateSchema)

module.exports = Candidates