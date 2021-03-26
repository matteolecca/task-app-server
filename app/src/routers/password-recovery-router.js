//Router responsible for handling email reset request

const express = require('express')
const router = new express.Router()
const db = require('../db/database')
var nodemailer = require('nodemailer');
const bycript = require('bcrypt')
const hbs = require("nodemailer-express-handlebars");

//Create object email
var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL,
      pass: process.env.GMAIL_PASSWORD
   }
});

//options object contains path to render email 
const options = {
    viewEngine: {
        partialsDir: __dirname + "/../email",
        layoutsDir: __dirname + "/../email",
        extname: ".hbs"
     },
   extName: ".hbs",
   viewPath: __dirname + "/../email"
};

//Email options
var mailOptions = {
   from: '"Task App" <taskmanagementappbristol@gmail.com>',
   subject: 'Password Reset',
   template: "main",
   attachments: [{
    filename: 'forgotPSW.png',
    path: __dirname + '/../email/logo.png',
    cid: 'logo' //same cid value as in the html img src
},]
};
transporter.use("compile", hbs(options));

//Post request received when user reset his password
router.post('/resetpwd', async (req, res) => {
   //Generate random password
   let pass = Math.random().toString(36).substring(2,8)
   //Create user object
   let user = {
      password: await bycript.hash(pass, 8),
      email: req.body.email
   } 
   //Add new password to text email variable
   mailOptions.text = pass
   //Add user email as receiver
   mailOptions.to = user.email
   //Add email subject
   mailOptions.context = {
      password: pass
   }
   transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                  console.log(error);
               } else {
                  console.log('Email sent: ' + info.response);
               }
            });
   //Try to update user record into the database
   // db.updatePasswordUser(user, (result,error)=>{
   //    //If the user has been updated, i.e. the email inserted is present into the database
   //    if(result > 0){
   //       //Send new password via email
   //       transporter.sendMail(mailOptions, function (error, info) {
   //          if (error) {
   //             console.log(error);
   //          } else {
   //             console.log('Email sent: ' + info.response);
   //          }
   //       });
   //    }
   //    //Redirect user to confirmation
   //    res.send({result : "updated"})
   // })

   res.send(user)
})

module.exports = router