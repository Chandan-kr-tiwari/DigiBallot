const express = require('express')

const router = express.Router()

const {jwtAuthMiddleware,generateToken} =require('./../jwtAuthMiddleware')

const User = require('./../models/users.schema')

const adminRole = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.id)
        if(user&& user.role==='admin'){
            return next()
        }
        else{
            res.status(403).json({msg:"Acess denied"})
            next()
        }
    } catch (error) {
        next(error)
    }
}
// const passport = require('./../auth')

 router.post('/signup',async (req,res)=>{
    try {
     const data = req.body
     const newUser = new User(data)
     const response= await newUser.save()
     console.log("Congratulations data saved")  
     const payLoad = {
        id:response.id
     }
     console.log(JSON.stringify(payLoad));
     const token = generateToken(payLoad) // here we have to use payload so anything we want we can use from the body 
     console.log("Token:" ,token)

     console.log(payLoad)
     res.status(200).json({response:response , token:token})
     
    } catch (error) {
     console.log(error)
     res.status(500).json({error:"Internal server"})
    }
 })

 
// Login Route
router.post('/login', async(req, res) => {
    try{
        // Extract adhaarcard and password from request body
        const {adhaarcard, password} = req.body;
        
        // for debugging
        console.log('Received:', adhaarcard, password);


        // Find the user by adhaarcard
        const user = await User.findOne({adhaarcard:adhaarcard});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate Token 
        const payload = {
            id: user.id
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


 // routes for profile
 router.get('/profile',jwtAuthMiddleware, async function(req,res){
    try {
        const userData = req.user
        // for debugging pupose
        // console.log(req.user)
        // console.log("userData:",userData)
        // if (!userData || !userData.id) {
        //     return res.status(401).json({ error: 'User data not found in token' });
        // }
        const userId= userData.id
        console.log("userId:",userId)
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user)

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server"})
    }
 })

// routes for updation in password
router.put('/profile/password',jwtAuthMiddleware,async function(req,res){
    try {
        const userId = req.user.id  // extract id from the token
        const {currentPassword,newPassword} = req.body // extract both password from the body
        // find the user by userId
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({msg:'User not found'})
        // if password does not match

        if(!(await user.comparePassword(currentPassword))){
           return res.status(401).json({msg:'invalid password'})
        }
         // update the user's password

         user.password= newPassword
         await user.save()
         console.log("password updated")
         res.status(200).json({msg:"password updated"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server"})
    }
})

// Route for admin to see all the voters
router.get('/voters',jwtAuthMiddleware,adminRole,async function (req,res){
    try {
        
        const response = await User.find()
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server"})
    }
})




module.exports = router
