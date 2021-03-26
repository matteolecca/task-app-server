var database = require("../db/database");
var asyncDB = require('../db/asyncDB')
var rounder = require("./round")
//Scheduling algorithm
exports.scheduleTasks = (async (user, callback) => {
    console.log('Scheduling...')
    //Get user hoursperday 
    const hpd = await asyncDB.getUserHoursperday(user.ID)
    user.hoursperday = parseInt(hpd.hoursperday)
    //Filter user task to get only actives

    const activeTasks = await asyncDB.getFilteredTasks(user.ID, 'active')
    if (activeTasks.length === 0) return []
    let timeslot = activeTasks[0].deadline
    let sumPriority = 0
    //For each task of the list
    const listUpdated = await activeTasks.map(task =>{
        const newPriority = timeslot / task.deadline * task.priority
        sumPriority += newPriority
        return {...task, newPriority : newPriority}
    })

    const average = timeslot / sumPriority
    listUpdated.forEach(element => {
        //Set total time for task expressed in hours
        element.time = average * element.newPriority
    });
   
    const tasksToUpdate = await getTasksToUpdate(listUpdated,user,timeslot)
    return tasksToUpdate
})

const getTasksToUpdate = async (listUpdated, user, timeslot) =>{
    let hourUsed = 0
    let numDays = timeslot / parseInt(user.hoursperday)
    const tasksToUpdate = await listUpdated.map( (element, index, list) => {
        //Get hours per day for each task
        let hoursPerDay = element.time / numDays
        //Round it up to 1st decimal
        hoursPerDay = rounder.roundNumber(hoursPerDay)
        //Total of hours assigned to tasks
        hourUsed += hoursPerDay
        //If the current task is the last one
        if (index === list.length - 1) {
            //If there is time left not assigned yet
            if (hourUsed < user.hoursperday) {
                //Add time left to last task
                hoursPerDay += user.hoursperday - hourUsed
            }
        }
        return {hoursperday : hoursPerDay, ID : element.ID }
    })
    console.log('Returning tasks to update...', tasksToUpdate)
    return tasksToUpdate
}

