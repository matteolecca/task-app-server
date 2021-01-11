const express = require('express')
const router = new express.Router()
const dbAsync = require('../db/asyncDB')
const bcrypt = require('bcrypt')
const userGenerator = require('../models/user')
const webToken = require('../helper/webTokenValidator')


router.post('/signup', async (req, res) => {
    const existingUser = await dbAsync.getUserByEmail(req.body.email)
    if (existingUser) return res.status(200).send({ error: "A user with this email address already exists" })
    let user = null
    try {
        user = await userGenerator(req.body)
    }
    catch (error) {
        return res.status(400).send(error.message)
    }
    const result = await dbAsync.createUser(user)
    if (result.error) return res.status(400).send(result)
    user.id = result.insertId
    user.token =  webToken.generateToken(result.insertId)
    return res.send(user)
})

router.post('/login', async (req, res) => {
    const user = await dbAsync.getUserByEmail(req.body.email)
    console.log("user", user)
    if (!user) return res.status(200).send({ error: "Invalid password or email" })
    if (user.error != undefined) return res.status(400).send(user.error)
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if (isPasswordValid) {
        user.token =  webToken.generateToken(user.ID)
        return res.send(user)
    }
    return res.status(200).send({ error: "Invalid password or email" })
})

router.get('/user/:token', async (req, res) => {
    const token =  webToken.validateToken(req.params.token)
    console.log('Token', token)
    const user = await dbAsync.getUser(token.id)
    console.log('User', user)
    if(user.error) return res.send({logged : false})
    return res.send({user:user, logged : true})
})

router.post('/resetpassword',async (req,res)=>{
    const token =  webToken.validateToken(req.body.token)
    if(token.error) return res.status.send(token.error)
    const result  = await dbAsync.resetPassword(req.body.password, token.id)
    if (result.error) return res.status(400).send(result)
    return res.send()
})

module.exports = router