const { call } = require('body-parser')
const db = require('./connectDB')
const dateFormat = require('dateformat');
exports.getUsers = ((callback)=>{
    const query = "SELECT  * FROM users"
    db.query(query, (error,result)=>{
        if(error) return callback(error)
        callback(result)
    })
})

exports.createUser = ((user,callback)=>{
    let query = "INSERT INTO users (email,name,password,hoursperday,token) "
    query += "VALUES (?,?,?,?,?)"
    db.query(query, [user.email, user.name, user.password, user.hoursperday,user.token],(error,result)=>{
        if (error) return callback(error, undefined)
        else return callback(undefined,result)
    })
})

exports.getUser = ((email, callback) => {
    let query = "SELECT * FROM users where email = ? "
    db.query(query, email, (error, result) => {
        if (error) return callback(error, undefined)
        else return callback(undefined, result)
    })
})



exports.checkToken = ((token, callback) => {
    let query = "SELECT * FROM users where token = ? "
    db.query(query, token, (error, result) => {
        if (error) return callback(error, undefined)
        else return callback(undefined, result)
    })
})
//Create new task
exports.createTask = ((task,userID,  hoursperday, callback) => {
    let query = "INSERT INTO tasks (start_date, end_date, text, color, user, deadline, priority, mintimeperday) VALUES (? ,?, ?, ?, ?, ?, ?, ?)"
    // query += ""
    let date1 = new Date(task.end_date);
    let date2 = new Date(task.start_date);
    let Difference_In_Time = date1.getTime() - date2.getTime();
    let Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) * hoursperday ;
    let data = [task.start_date, task.end_date, task.text, task.color, userID, Difference_In_Days + hoursperday, task.priority, 1]
    db.query(query, data, function (error, result) {
        if (error) {
            return callback(error)
        }
        else {
            return callback(result)
        }
    })
})


exports.getUserTasks = ((userID, callback) => {
    let query = "SELECT * FROM tasks where user = ? "
    db.query(query, userID, (error, result) => {
        if (error) return callback(error, undefined)
        else return callback(undefined, result)
    })
})
exports.updateTaskHours = ((data, callback) => {
    let query = "UPDATE tasks set hoursperday = ? where ID = ?"
    db.query(query, [data.hoursPerDay, data.ID], function (error,result) {
        if (error) return callback(error)
        return callback()
    })
})
exports.deleteTask = ((user,ID,callback) => {
    let query = "DELETE FROM tasks where user = ? AND ID = ?"
    db.query(query,[user,ID], (error, result) => {
        if (error) return callback(error, undefined)
        else return callback(undefined, result)
    })
})

//Update uoursperday value for selected task
exports.updateTaskHours = ((data, callback) => {
    let query = "UPDATE tasks set hoursperday = ? where ID = ?"
    db.query(query, [data.hoursPerDay, data.ID], function (error,result) {
        if (error) return callback(error)
        return callback()
    })
})

//Get only active tasks
exports.getFilteredTasks = ((ID, callback) => {
    let today = dateFormat(new Date().toString(), "yyyy-mm-dd")
    let query = "SELECT * FROM tasks WHERE user = ? and DATE(start_date) <= ? and DATE(end_date) >= ? ORDER BY deadline ASC"
    db.query(query, [ID, today, today], function (error, list) {
        if (error) return console.log({ error: error })
        return callback(list)
    })
})

//Get only active tasks
exports.getFilteredTasksSorted = ((ID, callback) => {
    let today = dateFormat(new Date().toString(), "yyyy-mm-dd")
    let query = "SELECT * FROM tasks WHERE user = ? and DATE(start_date) <= ? and DATE(end_date) >= ? ORDER BY  hoursperday DESC"
    db.query(query, [ID, today, today], function (error, list) {
        if (error) return console.log({ error: error })
        return callback(list)
    })
})
//Update single task
exports.updateTask = ((task, hoursperday,callback) => {
    let query = "UPDATE tasks set start_date = ?, end_date = ?, text = ?, priority = ?, deadline = ?, color = ? where user = ? and ID = ?"
    let date1 = new Date(task.end_date);
    let date2 = new Date(task.start_date);
    let Difference_In_Time = date1.getTime() - date2.getTime();
    let Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) * hoursperday;
    let data = [task.start_date, task.end_date, task.text, task.priority, Difference_In_Days ,task.color, task.user, task.ID]
    db.query(query, data, function (error, result) {
        if (error) return callback(error)
        return callback(result)
    })
})

//Update user data
exports.updateUser = ((user, callback) => {
    let query = "UPDATE users set name = ?, hoursperday = ?, email = ? where users.email = ?"
    let data = [user.name, user.hoursperday, user.email, user.email]
    db.query(query, data, function (err) {
        if (err) return callback(err)
        return callback()
    })
})

exports.updateUserData = ((data, dataType,ID, callback) =>{
    let query = getQuery(dataType)
    let datas = [ data, ID]
    db.query(query, datas, function (error,result) {
        if (error) return callback(error)
        return callback(result)
    })
})

let getQuery = (dataType) =>{
    switch (dataType) {
        case "name":
            return "UPDATE users set name = ? WHERE ID = ?"
        case "email":
            return "UPDATE users set email = ? WHERE ID = ?"
        case "hoursperday":
            return "UPDATE users set hoursperday = ? WHERE ID = ?"
        case "password":
            return "UPDATE users set password = ? WHERE ID = ?"
        default:
            return 
    }
}

//Update user password
//Used when client forgot email
exports.updatePasswordUser = ((user, callback) => {
    let query = "UPDATE users set password = ? where users.email = ?"
    let data = [user.password, user.email]
    db.query(query, data, function (err, result) {
        if (err) return callback(err)
        return callback(result.affectedRows)
    })
})