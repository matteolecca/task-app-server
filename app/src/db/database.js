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
    let query = "INSERT INTO users (email,name,password,hoursperday) "
    query += "VALUES (?,?,?)"
    db.query(query, [user.email,user.name,user.password,user.hoursperday],(error,result)=>{
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

//Create new task
exports.createTask = ((task, hoursperday, callback) => {
    let query = "INSERT INTO tasks (start_date, end_date, text, color, user, deadline, priority, mintimeperday)"
    query += "VALUES (? ,?, ?, ?, ?, ?, ?, ?)"
    let end_date = new Date(task.end_date);
    let start_date = new Date(task.start_date);
    let Difference_In_Time = end_date.getTime() - start_date.getTime();
    let Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) * hoursperday + 1;
    db.query(query, [start_date, end_date, task.text, task.color, task.user, Difference_In_Days, task.priority, task.mintimeperday], function (error, result) {
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
    let query = "DELETE FROM tasks where user = 1 AND ID = ?"
    
    db.query(query,[ID], (error, result) => {
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
exports.getFilteredTasks = ((user, callback) => {
    let today = dateFormat(new Date().toString(), "yyyy-mm-dd")
    let query = "SELECT * FROM tasks WHERE user = ? and DATE(start_date) <= ? and DATE(end_date) >= ? ORDER BY deadline ASC"
    db.query(query, [user.ID, today, today], function (error, list) {
        if (error) return console.log({ error: error })
        return callback(list)
    })
})

//Update single task
exports.updateTask = ((task, callback) => {
    let query = "UPDATE tasks set start_date = ?, end_date = ?, text = ?, priority = ?, deadline = ?, color = ? where user = ? and ID = ?"
    let date1 = new Date(task.end_date);
    let date2 = new Date(task.start_date);
    let Difference_In_Time = date1.getTime() - date2.getTime();
    let Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) * 5;
    let data = [task.start_date, task.end_date, task.text, task.priority, Difference_In_Days + 1,task.color, task.user, task.ID]
    db.query(query, data, function (error, result) {
        if (error) return callback(error)
        return callback(result)
    })
})