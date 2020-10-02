const session = require('express-session')

exports.session = session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        //Store cookie one year
        maxAge: 24 * 365 * 60 * 60 * 1000,
        httpOnly: true
    }
})