const express = require('express')
const router = new express.Router()
const database = require('../db/database')
const dateFormat = require('dateformat');
const scheduler = require('../alg/schedule')


//Post function when new task is added
router.post('/task', async (req, res) => {
    //If no user data present in current session
    // if (!req.session.user) res.send({ error: "You don't have the permission to add a new task" })
    //Generate task object
    if (!req.session.user) {
        return res.status(400).send("Please login again")
    }
    
    let query = Object.assign({}, req.body)
    //Add user value
    query.user = req.session.user.ID
    
    query.start_date =  dateFormat(req.body.start_date, "yyyy-mm-dd")
    query.end_date =  dateFormat(req.body.end_date, "yyyy-mm-dd")
    
    
    //Call createTask database method
    database.createTask(query, req.session.user.hoursperday, (result, error) => {
        if (error) {
            return res.status(400).send(error)
        }
        scheduler.scheduleTasks(req.session.user, (schedule) => {
            return res.status(200).send(result)
        })
    })
})
router.get('/tasks', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).send("Please login again")
    }
    scheduler.scheduleTasks(req.session.user, (schedule) => {
        return res.send(schedule)
    })
})


router.get('/allTasks', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).send("Please login again")
    }
        database.getUserTasks( req.session.user.ID, (error, result) => {
            if (error) {              
                return res.status(400).send(error)
            }
        return res.send(result)     
    })
})
router.post('/deleteTask', async (req, res) => {
    if (!req.session.user) {
        res.status(400).send("Please login again")
    }
    database.deleteTask(req.session.user.ID,req.body.ID,(error, result) => {
        if (error) {
            return res.status(400).send(error)
        }
        scheduler.scheduleTasks(req.session.user, (schedule) => {
            return res.send(result)
        })
    })
})
//Post function when user edit existing task
router.post('/editTask', (req, res) => {
    //Take copy of body of request
    let query = Object.assign({}, req.body)
    //Add user value
    query.user = req.session.user.ID
    query.ID = parseInt(req.body.ID)
    query.start_date =  dateFormat(req.body.start_date, "yyyy-mm-dd")
    query.end_date =  dateFormat(req.body.end_date, "yyyy-mm-dd")
    //Database function to update task
    database.updateTask(query,req.session.user.hoursperday, (result, error) => {
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