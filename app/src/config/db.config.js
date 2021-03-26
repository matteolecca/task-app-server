//Database configuration

require('dotenv').config()
module.exports = {
    HOST: process.env.HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB
};


//Connect DB via terminal MYSQL


//mysql --host=us-cdbr-east-02.cleardb.com --user=b3cc0996cbc46f --password=22721ae4 --reconnect heroku_ddaec690967f493

