const express = require("express");
const bodyParser = require("body-parser");
const database = require('./app/src/db/database')
const bycript = require('bcrypt')
const app = express();
const userRouter = require('./app/src/routers/user-router')
const taskRouter = require('./app/src/routers/task-router')
const emailRouter = require('./app/src/routers/password-recovery-router')
// const session = require('./app/src/session/session')
const { __esModule } = require("validator/lib/isAlpha");

//Select website that can access the API
const cors = require('cors')
var corsOptions = {
    origin : [ 'http://localhost:3000','http://192.168.1.146:3000/', ],
    credentials:true,
    methods:['GET','POST'],
    sameSite : 'none'
}
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// app.use(session.session)
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//Users requests
app.use(userRouter)
//Tasks requests
app.use(taskRouter)
app.use(emailRouter)
// simple route

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});



