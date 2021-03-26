var jwt = require('jsonwebtoken');


exports.validateToken =  token =>{
    try{
        var decoded =  jwt.verify(token, process.env.TOKEN_SECRET)
        return decoded
    }
    catch(error){
        return {error:error.message}
    }
}

exports.generateToken =  userID =>{
    console.log("Generating token")
    const token = jwt.sign({ id: userID }, process.env.TOKEN_SECRET, {
        expiresIn: 86400 
      });
      return token
}