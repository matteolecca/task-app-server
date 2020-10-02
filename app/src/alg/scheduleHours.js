exports.scheduleHours = (list,callback) =>{
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
    
    callback(list)

}