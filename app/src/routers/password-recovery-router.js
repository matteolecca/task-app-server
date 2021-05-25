//Router responsible for handling email reset request

const express = require('express')
const router = new express.Router()
const db = require('../db/asyncDB')
const bcrypt = require('bcrypt')
const { sendEmail } = require('../email/password-recovery')


router.post('/resetpwd', async (req,res)=>{
   const { email } = req.body
   if(!email) return res.status(400).send({error : 'Invalid email'})
   const existingUser = await db.getUserByEmail(email)
   if(!existingUser) {  return res.send()}
   console.log('resetPWD', email) ;
   const newpwd = Math.random().toString(36).substring(2,8)
   const encrPwd = await bcrypt.hash(newpwd, 8)
   console.log(newpwd, encrPwd)
   const updatePwd = await db.resetPwd(existingUser.email, encrPwd)
   console.log(updatePwd)
   if(updatePwd.error) return res.status(400).send()
   const emailSent =  await sendEmail(email, existingUser.name, newpwd)
   // if(emailSent.error) return res.status(400).send()
   return res.send()
})

module.exports = router