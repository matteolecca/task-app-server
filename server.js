const express = require("express");
const bodyParser = require("body-parser");
const database = require('./app/src/db/database')
const bycript = require('bcrypt')
const app = express();
const userRouter = require('./app/src/routers/user-router')
const taskRouter = require('./app/src/routers/task-router')

const session = require('./app/src/session/session')
const { __esModule } = require("validator/lib/isAlpha");
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(session.session)
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//Users requests
app.use(userRouter)
//Tasks requests
app.use(taskRouter)

// simple route


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
