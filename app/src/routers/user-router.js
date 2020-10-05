const express = require('express')
const router = new express.Router()
const database = require('../db/database')
const User = require('../models/user')
const bycript = require('bcrypt')
const { use } = require('bcrypt/promises')
const scheduler = require('../alg/schedule')

router.get('/users', (req, res) => {
    database.getUsers((result, error) => {
        console.log(result)
        if (result) return res.send({ users: result })
        res.status(400).send({ error: "Something went wrong" })
    })
})

router.get('/', (req, res) => {
    console.log(req.session.user)
    res.send(req.session.user)
})

router.post('/user', async (req, res) => {
    
    try {
        let user = await User.user(req.body)
        database.createUser(user, (error, result) => {
            if (result) {
                user.ID = result.insertId
                user.hoursperday = parseInt(user.hoursperday)
                req.session.user = user
                req.opp = 1
                console.log(user)
                return res.status(200).send(user)
            }
            else if (error) {
                console.log(error)
                return res.status(400).send({ error: "Something went wrong insertin new user" })

            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }

   
})

router.post('/login', async (req, res) => {

    console.log(req.body)
    database.getUser(req.body.email, (error, result) => {
        if (result) {
            try{
                const isPasswordValid = bycript.compareSync(req.body.password, result[0].password)
                if (isPasswordValid) {
                    req.session.user = result[0]
                    req.opp = 1
                    return res.status(200).send(result[0])
                }

                return res.status(400).send({error:  "Invalid password"})
            }
            catch(error){
                return res.status(400).send({error : "Bycript"})            
            }
            
        }
        else if (error) {
            return res.status(400).send({ error: "Something went wrong  logging you in" })
        }
    })
})
module.exports = router

//Update request sent when user change information
router.post('/update', async (req, res)=>{
    let user
    try {
        //Validate values inserted
        //Store result in user variable
        user = await User.userUpdate(req.body,req.session.user.ID)
    } catch (error) {
        return res.status(400).send({ error: "Invalid email" })
    }
    //Database function to update user record
    db.updateUser(user, (error)=>{
        if (error) return res.status(400).send(error)
        else {
            //User info modified therefore new scheduling needed       
            scheduler.scheduleTasks(user, () => {
                req.session.user.hoursperday = parseInt(req.body.hoursperday)
                req.session.opp = 1
                return res.send(user)
            })
        }
    })
})


router.post('/updateUser', async (req, res) => {
    if(req.session.user == undefined)return res.status(400).send()
    let value = req.body.value
    let type = req.body.type
    database.updateUserData(value,type,req.session.user.ID,(result,error)=>{
       if(error) return res.status(400).send()
       else{
           if(type == "hoursperday"){
               scheduler.scheduleTasks((schedule)=>{
                return res.send()
               })
           }
           return res.send()
       }
       
    })
})