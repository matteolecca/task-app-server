//Router responsible for handling email reset request

var nodemailer = require('nodemailer');
const hbs = require("nodemailer-express-handlebars");
require('dotenv').config()

module.exports.sendEmail = async (email,name, pwd) => {
   //Create object email
   var transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
         user: process.env.EMAIL,
         pass: process.env.EMAIL_PASSWORD
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
      from: '"Taskinator" <todo-password-recovery@outlook.it>',
      subject: 'Password Reset',
      template: "main",
      attachments: [{
         filename: 'forgotPSW.png',
         path: __dirname + '/../email/logo.png',
         cid: 'logo' //same cid value as in the html img src
      },]
   };
   transporter.use("compile", hbs(options));
   
   mailOptions.to = email
   mailOptions.context = {
      password: pwd,
      name : name
   }
   const result = await transporter.sendMail(mailOptions);
   console.log(result)
   return result
}