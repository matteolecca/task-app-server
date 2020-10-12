var database = require("../db/database");
var rounder = require("./round")
//Scheduling algorithm
exports.scheduleTasks = ((user, callback) => {
    //Get user hoursperday 
    user.hoursperday = parseInt(user.hoursperday)
    console.log(user.hoursperday)
    let tasks = []
    //Filter user task to get only actives

    database.getFilteredTasks(user.ID,(list, error) => {
        
        if (error) return ({ error: "Unexpected SQL error happened", errCODE: error })
        //If the list is empty return
        if (list.length < 1) {
            callback()
            return 
        }
        
        //Get most closer deadline
        //Task list sorted by closer deadline
        let timeslot = list[0].deadline
        let sumPriority = 0
        //For each task of the list
        list.forEach(element => {
            //Calculate newPriority
            element.newPriority = timeslot / element.deadline * element.priority
            //Get total sum for all tasks
            sumPriority += element.newPriority
        });
        const average = timeslot / sumPriority
        list.forEach(element => {
            //Set total time for task expressed in hours
            element.time = average * element.newPriority
        });
        //Convert time in numer of days
        let numDays = timeslot / parseInt(user.hoursperday)
        var hourUsed = 0
        var tasksUpdated = 0
         list.forEach(async (element, index, list) => {
            //Get hours per day for each task
            var hoursPerDay = element.time / numDays
            //Round it up to 1st decimal
            hoursPerDay = await rounder.roundNumber(hoursPerDay)
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
            element.hoursperday = hoursPerDay
            //Add task id and relative hours per day to object data
            let data = { hoursPerDay: hoursPerDay, ID: element.ID }
            //Push object to tasks array
            tasks.push(data)

           
            //Update task record into the database
             database.updateTaskHours(data, (error,result) => {
                //  console.log(error,result)
                if (error) {
                    console.log({ error: "Unexpected SQL error happened", errCODE: error })
                    callback(error)
                }
                else{
                    tasksUpdated++;
                    if(tasksUpdated === list.length){
                        callback()
                    }
                }
            })
        })
        //Return tasks via callback -> Used only in testing
        
    })
})