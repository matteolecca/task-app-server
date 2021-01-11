const db = require("./connectAsyncDB");
const dateFormat = require('dateformat');



exports.getUserByEmail = async userEmail =>{
    const query = 'SELECT * FROM users where email = ?'
    const result = await tryCcatch(query,userEmail, true)
    return result
}
exports.getUser = async userID =>{
    const query = 'SELECT * FROM users where ID = ?'
    const result = await tryCcatch(query,userID, true)
    console.log(result)
    return result
}

exports.getUserHoursperday = async userID =>{
    const query = 'select hoursperday from users where ID = ?'
    const result = await tryCcatch(query,userID, true)
    return result
}
exports.createUser = async user =>{
    let query = 'INSERT INTO users (name,email,password, hoursperday) values'
    query += '(?,?,?,?)'
    const params = [user.name, user.email, user.password, 5]
    const result = await tryCcatch(query,params)
    return result
}

exports.createTask = ( async (task,userID,  hoursperday, callback) => {
    let query = "INSERT INTO tasks (start_date, end_date, text, color, user, deadline, priority, mintimeperday) VALUES (? ,?, ?, ?, ?, ?, ?, ?)"
    let date1 = new Date(task.end_date);
    let date2 = new Date(task.start_date);
    let Difference_In_Time = date1.getTime() - date2.getTime();
    let Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) * hoursperday ;
    let params = [task.start_date, task.end_date, task.text, task.color, userID, Difference_In_Days + hoursperday, task.priority, 1]
    const result = await tryCcatch(query,params)
    return result
})

exports.getFilteredTasks = async (ID,type) => {
    let today = dateFormat(new Date().toString(), "yyyy-mm-dd")
    let query = ''
    if (type==='active') query = 'SELECT * FROM tasks WHERE user = ? and completed = 0 and DATE(start_date) <= ? and DATE(end_date) >= ? ORDER BY deadline ASC'
    if(type === 'scheduled') query = 'SELECT * FROM tasks WHERE user = ? and DATE(start_date) > ? and DATE(end_date) > ? ORDER BY deadline ASC'
    if(type === 'passed') query = 'SELECT * FROM tasks WHERE user = ? and (DATE(start_date) < ? and DATE(end_date) < ?) OR completed = 1 ORDER BY deadline ASC'
    if(type === 'completed') query = 'SELECT * FROM tasks WHERE user = ? and completed = 1'
    if(type === 'uncompleted') query = 'SELECT * FROM tasks WHERE user = ? and completed = 0'
    if(type === 'all') query = 'SELECT * FROM tasks WHERE user = ?'
    const params = [ID, today, today]
    const result = await tryCcatch(query, params) 
    return result
}

exports.getCompletedTasks = userID =>{
    const query = 'SELECT * FROM tasks WHERE completed = 1 and user = ?'
    const params = [userID]
    const result = tryCcatch(query, params)
    console.log(result)
    return result    
}

exports.getTasksCount = async userID =>{
    const today = dateFormat(new Date().toString(), "yyyy-mm-dd")
    let query = "select "
    query += "sum(case when user = ? and DATE(start_date) <= ? and DATE(end_date) >= ? then 1 else 0 end) as active,"
    query += "sum(case when user = ? and DATE(start_date) > ? and DATE(end_date) > ? then 1 else 0 end) as scheduled,"
    query += "sum(case when user = ? and DATE(start_date) < ? and DATE(end_date) < ? then 1 else 0 end) as passed from tasks;"
    const params = [userID, today,today,userID, today,today,userID, today,today, ]
    const result = await tryCcatch(query, params,true) 
    console.log(result)
    return result
}


exports.setTaskCompleted = async (userID, taskID) =>{
    const query = "UPDATE tasks SET completed = 1 where user = ? and ID = ? "
    const params = [ userID, taskID]
    const result = await tryCcatch(query, params)
    return result
}

exports.updateTasksHours = async (taskID, hoursperday) =>{
    const query = "UPDATE tasks SET hoursperday = ? WHERE ID = ?"
    const params = [ hoursperday, taskID]
    const result = await tryCcatch(query, params)
    return result
}

exports.getUserTasks = async userID => {
    const query = "SELECT * FROM tasks where user = ? "
    const result = await tryCcatch(query, userID)
    return result
}

exports.deleteTask = async (taskID, userID) => {
    const query = "DELETE FROM tasks where user = ? and ID = ?"
    const result = await tryCcatch(query, [userID, taskID])
    return result
}


const tryCcatch = async (query, params, deeper) => {
    let result = null
    try {
        result = await db.query(query, params);
    }
    catch (error) {
        return ({ error: error.message })
    }
    if (deeper) return result[0][0]
    return result[0]
}
