const express = require('express')
const multer = require('multer')  
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


//Signup 
router.post('/users', async (req, res) => { 
    const user = new User({
        ...req.body,
    })
    
    try {
        const username = req.body.username
        const email = req.body.email

        const ifUsernameExists = await User.findOne({ username })
        const ifEmailExists = await User.findOne({ email })

        if(ifUsernameExists)
        {
            res.status(201).send({"msg" :"Username Already exists!"})
        }
        else if(ifEmailExists)
        {
            res.status(201).send({"msg" : "Email already exists!"})
        }
        else{
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user ,token ,"msg" : "User Created!"})
        }       
    } catch (e) {
        res.status(400).send(e)
    }
})
 
//Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
            const token = await user.generateAuthToken()
            res.send({ user, token })      
    } catch (e) {
        console.log(e)
        if(e=='Error: Password does not match')
        res.status(400).send({error: 'Password does not match!'})
        else
        res.status(400).send({error: 'User not found!'})
    }
})

//Logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}) 

//My profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})



//Delete My Account
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


 
module.exports = router