const bcrypt = require ('bcrypt')
const validator = require ('validator')

const createUser = async (userdata) =>{
    if(!validator.isEmail(userdata.email)){
        throw new Error('INVALID EMAIL')
    }
    if(userdata.password.length < 6){
        throw new Error('PASSWORD TOO SHORT')
    }
    const user = {
        ...userdata,
        password : await bcrypt.hash(userdata.password, 8)
    }
    return user
}

module.exports = createUser