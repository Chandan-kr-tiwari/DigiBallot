const mongoose = require('mongoose')

const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
    
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    adhaarcard:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})

userSchema.pre('save', async function (next){
    const user = this
    // hash the password if person has modified
    if(!user.isModified('password')) return next()
    try {
       // hash password generation
       const salt = await bcrypt.genSalt(10)  // it will generate the salt in 10 rounds more rounds need more computational and more complex salt will generate in this case
       const hashPassword = await bcrypt.hash(user.password,salt)
       // overwrite the plain text password with the hashed password
       user.password=hashPassword

        next()
    } catch (err){
        return next(err)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        // use bcrypt for comaprePassword formation
        const isMatch = await bcrypt.compare(candidatePassword,this.password)
        return isMatch
    } catch (error) {
        throw error
    }
    }

const User = new mongoose.model('User',userSchema)

module.exports = User