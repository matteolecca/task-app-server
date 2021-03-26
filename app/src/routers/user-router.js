const express = require('express')
const router = new express.Router()
const dbAsync = require('../db/asyncDB')
const bcrypt = require('bcrypt')
const userGenerator = require('../models/user')
const webToken = require('../helper/webTokenValidator')
const scheduler = require('../alg/schedule')


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
    delete user.password
    return res.send(user)
})

router.post('/login', async (req, res) => {
    const user = await dbAsync.getUserByEmail(req.body.email)
    if (!user) return res.status(200).send({ error: "Invalid password or email" })
    if (user.error != undefined) return res.status(400).send(user.error)
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if (isPasswordValid) {
        user.token =  webToken.generateToken(user.ID)
        delete user.password
        return res.send(user)
    }
    return res.status(200).send({ error: "Invalid password or email" })
})

router.get('/user/:token', async (req, res) => {
    const token =  webToken.validateToken(req.params.token)
    if(token.error)return res.send({logged : false})
    const user = await dbAsync.getUser(token.id)
    if(user.error) return res.send({logged : false})
    delete user.password
    return res.send({logged : true, user : user})
})

router.post('/updateuser/:type/:token', async (req,res)=>{
    const token =  webToken.validateToken(req.params.token)
    const type = req.params.type
    let value = req.body.value
    if(token.error)return res.send({logged : false})
    if(type === 'password') value = await bcrypt.hash(req.body.value, 8)
    const result = await dbAsync.updateUserData(token.id, value, type)
    const schedule = await scheduleTasks(token.id)
    res.send("Updated")
})
router.post('/resetpassword',async (req,res)=>{
    const token =  webToken.validateToken(req.body.token)
    if(token.error) return res.status.send(token.error)
    const result  = await dbAsync.resetPassword(req.body.password, token.id)
    if (result.error) return res.status(400).send(result)
    return res.send()
})
const scheduleTasks = async userID =>{
    const schedule = await scheduler.scheduleTasks({ID:userID})
    if(schedule.error)return res.status(400).send(schedule)
    console.log("Schedule returned to server")
    for(const index in schedule){
        console.log('Updating in server...')
        const update = await dbAsync.updateTasksHours(schedule[index].ID, schedule[index].hoursperday)
        if(update.error) return ({error : 'Error updating'})
    }
    console.log('Result returned')
    return ({result : 'updated'})
}
module.exports = router