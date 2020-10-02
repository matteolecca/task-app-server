const validator = require('validator')
const bycript = require('bcrypt')

class User {
    constructor(userData) {
        this.name = userData.name
        this.email = userData.email
        this.password = userData.password
        this.hoursperday = userData.hoursperday
    }
}

exports.user = async (userData) => {
    //Copy userData value to new object
    //userData is a pointer to the object passed do not modify directly 
    let user = Object.assign({}, userData)
    //If email is invalid throw error
    if (!validator.isEmail(userData.email)) {
        throw new Error('Invalid email')
    }
    //If password is too short throw error
    if (userData.password.length < 6) {
        throw new Error("Password should be of a minimum length of 6 characters!!")
    }
    else {
        //Encript password before assigning to user object
        user.password = await bycript.hash(userData.password, 8)
    }
    return new User(user)
}
