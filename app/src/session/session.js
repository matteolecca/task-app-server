const session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b3cc0996cbc46f',
    password: '22721ae4',
    database: 'heroku_ddaec690967f493'
};
 
var sessionDB = new MySQLStore(options);

exports.session = session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        //Store cookie one year
        maxAge: 24 * 365 * 60 * 60 * 1000,
        httpOnly: true
    },
    store : sessionDB
})