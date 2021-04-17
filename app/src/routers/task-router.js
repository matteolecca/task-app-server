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
    if (!token) return res.status(401).send({ error: 'Please login again' })
    const hpd = await dbAsync.getUserHoursperday(token.id)
    const result = await dbAsync.createTask(req.body, token.id, hpd.hoursperday)
    const update = await scheduleTasks(token.id)
    if (result.error) return res.status(400).send({ error: 'Something went wrong' })
    return res.send(result)
})


router.get('/tasks/:token/:type', async (req, res) => {
    const token = webToken.validateToken(req.params.token)
    if(token.error){ return res.status(401).send({logged : false})}
    // const update = await scheduleTasks(token.id)
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
    const update = await scheduleTasks(token.id)
    if (result.error) return res.status(400).send({ error: "Error updating task" })
    return res.send()
})


const scheduleTasks = async userID =>{
    console.log('SCheduling')
    const schedule = await scheduler.scheduleTasks({ID:userID})
    if(schedule.error)return res.status(400).send(schedule)
    console.log("Schedule returned to server")
    for(const index in schedule){
        const update = await dbAsync.updateTasksHours(schedule[index].ID, schedule[index].hoursperday)
        if(update.error) return ({error : 'Error updating'})
    }
    console.log('Result returned')
    return ({result : 'updated'})
}
//Post function when user edit existing task
router.post('/edit/:token', async (req, res) => {
    let task = {...req.body}
    const token = webToken.validateToken(req.params.token)
    if(!token) return res.status(400).send()
    const hpd = await dbAsync.getUserHoursperday(token.id)
    const result = await dbAsync.updateTask(task,hpd.hoursperday)
    if(result.error) return res.status(400).send()
    const update = await scheduleTasks(token.id)
    return res.send('OK')
})

module.exports = router