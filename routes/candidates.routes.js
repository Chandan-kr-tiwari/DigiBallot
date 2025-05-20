const express = require('express')

const router = express.Router()

const {jwtAuthMiddleware} =require('./../jwtAuthMiddleware')

const Candidate = require('./../models/candidates.schema')
const User = require('./../models/users.schema')
const { default: mongoose } = require('mongoose')

// Since we allow only admin role to perform any operations on candidate
// so we have to make a adminRoleCheck function as a middleware or a helper function
const adminRoleCheck = async(userId)=>{
    try {
        const user = await User.findById(userId)
        if(user&&user.role==='admin'){
            return true
        }  
    } catch (error) {
        return false
    }
}

// const passport = require('./../auth')
// routes for creation of candidate
 router.post('/',jwtAuthMiddleware,async (req,res)=>{
    try {
        if(! await adminRoleCheck(req.user.id)){
            return res.status(403).json({msg:"Access denied"})
        }
     const data = req.body
     const newCandidate = new Candidate(data)
     const response= await newCandidate.save()
     console.log("Congratulations data saved")  
     res.status(200).json({msg:"Congratulations!! candidate is created"})
     
    } catch (error) {
     console.log(error)
     res.status(500).json({error:"Internal server"})
    }
 })

// routes for updation in candidate 
router.put('/:candidateId',jwtAuthMiddleware,async function(req,res){
    try {
        if(! await adminRoleCheck(req.user.id)){
            return res.status(200).json({msg:"Access denied"})
        }
        const candidateId = req.params.id // here we have extracted the candidateId from the req params
        const updatedCandidate = req.body // here the admin should give us the updatedCandidate so we have extracted that also
        const response =  await Candidate.findByIdAndUpdate(candidateId,updatedCandidate ,{
            new:true, //here it returns the new document candidate
            runValidators:true  // here the mongoose validator will run to perform the schema type validations 
        })
        if(!response){
            return res.status(403).json({msg:"Candidate not found"})
        }
        res.status(200).json(response)

    } catch (error) {
        console.log(error)
     res.status(500).json({error:"Internal server"})
    }
})

// route for deletion of candidate
router.delete('/:candidateId',jwtAuthMiddleware,async function(req,res){
    try {
        
        if(! await adminRoleCheck(req.user.id)){
            return res.status(200).json({msg:"Access denied"})
        }
        const candidateId = req.params.id
        const response = await Candidate.findByIdAndDelete(candidateId)
        if(!response){
            return res.status(403).json({error:"Candidate not in database"})
        }
        res.status(200).json({msg:"Candidate deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server"})
        
}})

// Voting route

router.post('/vote/:candidateId',jwtAuthMiddleware,async (req,res)=>{
    const candidateId = req.params.candidateId.trim()// extract the candidatId from the request parameter
    const userId = req.user.id          // extract the userid
    try {
        const candidate = await Candidate.findById(candidateId)
        // console.log(candidate)
        if(!candidate){
            return res.status(404).json({msg:"Candidiate not found"})
        }
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({msg:"User not found"})
        }
        // if user is admin he is not allowed to vote
        if(user.role==='admin'){
            return res.status(403).json({msg:"Admin is allowed to vote"})
        }
        // if user has voted once then he is not able to vote again
        
        if (user.isvoted || await Candidate.findOne({ 'vote.user': userId })) {
            return res.status(403).json({ msg: "You have already voted" });
          }
          

        // Update the Candidate document

        candidate.vote.push({user:userId})
        candidate.voteCount++
        await candidate.save()

        // Update the user document

        user.isvoted =true
        await user.save()

        res.status(200).json({msg:"Congratulations Vote recorded successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server"})
    }
})

// VoteCount Route

router.get('/vote/count',async (req,res)=>{
    try {
        // Find all the candidates and sort them in descending voteCount order
        const candidate = await Candidate.find().sort({voteCount:'descending'})

        // Now here in candidate all the data will store and we don't want to show all the data
        // so now we will map the candidate to only return the party name and voteCount record

        const voteRecord =candidate.map((data)=>{
            return {
                party:data.party,
                name:data.name,
                voteCount:data.voteCount
            }
        })
        res.status(200).json(voteRecord)
        }
     catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server"})
    }
})

// Routes for list of candidates

router.get('/',jwtAuthMiddleware,async (req,res)=>{
    try {
        const candidates = await Candidate.find()
        res.status(200).json(candidates)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server"})
    }
})



module.exports = router