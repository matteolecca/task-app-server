const express = require('express')
const router = new express.Router()
const database = require('../db/database')
const dateFormat = require('dateformat');
const scheduler = require('../alg/schedule')
const dbAsync = require('../db/asyncDB')
const webToken = require('../helper/webTokenValidator')


//Post function when new task is added
router.post('/task/:token', async (req, res) => {
    const token = webToken.validateToken(req.params.token)
    if (!token) return res.status(400).send({ error: 'Please login again' })
    const hpd = await dbAsync.getUserHoursperday(token.id)
    console.log(hpd)
    const result = await dbAsync.createTask(req.body, token.id, hpd.hoursperday)
    const update = await scheduleTasks(token.id)
    if (result.error) return res.status(400).send({ error: 'Something went wrong' })
    return res.send(result)
})


router.get('/tasks/:token/:type', async (req, res) => {
    console.log("TASKS REQUESTED")
    const token = webToken.validateToken(req.params.token)
    const tasks = await dbAsync.getFilteredTasks(token.id, req.params.type)
    if (tasks.error) return res.status(400).send()
    return res.send(tasks)
})

router.get('/allTasks/:token', async (req, res) => {
    const token = webToken.validateToken(req.params.token)
    const tasks = await dbAsync.getUserTasks(token.id)
    if (tasks.error) return res.status(400).send()
    return res.send(tasks)
})
router.get('/taskscount/:token', async (req, res) => {
    const token = webToken.validateToken(req.params.token)
    const tasks = await dbAsync.getTasksCount(token.id)
    if (tasks.error) return res.status(400).send()
    console.log("TASKS COUNT", tasks)
    return res.send(tasks)
})

router.post('/deletetask/:token/:taskID', async (req, res) => {
    const token = webToken.validateToken(req.params.token)
    const taskID = req.params.taskID
    const result = await dbAsync.deleteTask(taskID, token.id)
    const update = await scheduleTasks(token.id)
    if (result.error) return res.status(400).send({ error: "Error deleting" })
    return res.send()
})

router.post('/completetask/:token/:taskID', async (req, res) => {
    const token = webToken.validateToken(req.params.token)
    const taskID = req.params.taskID
    const result = await dbAsync.setTaskCompleted (token.id, taskID)
    console.log(result, 'Taskc ompketed')
    const update = await scheduleTasks(token.id)
    if (result.error) return res.status(400).send({ error: "Error updating task" })
    return res.send()
})


const scheduleTasks = async userID =>{
    const schedule = await scheduler.scheduleTasks({ID:userID, hoursperday : 5})
    if(schedule.error)return res.status(400).send(schedule)
    console.log("Schedule returned to server")
    for(const index in schedule){
        console.log('Updating in server...')
        const update = await dbAsync.updateTasksHours(schedule[index].ID, schedule[index].hoursperday)
        if(update.error) return ({error : 'Error updating'})
    }
    console.log('Result returned')
    return ({result : 'updated'})
}
//Post function when user edit existing task
router.post('/editTask', (req, res) => {

    //Take copy of body of request
    let query = Object.assign({}, req.body)
    //Add user value
    query.user = req.session.user.ID

    query.ID = parseInt(req.body.ID)
    query.start_date = dateFormat(req.body.start_date, "yyyy-mm-dd")
    query.end_date = dateFormat(req.body.end_date, "yyyy-mm-dd")

    //Database function to update task
    database.updateTask(query, req.session.user.hoursperday, (result, error) => {
        if (error) {
            return res.send(error)
        }
        //Tasks list modified therefore new scheduling needed 
        scheduler.scheduleTasks(req.session.user, (schedule) => {
            return res.send(result)
        })
    })
})

module.exports = router