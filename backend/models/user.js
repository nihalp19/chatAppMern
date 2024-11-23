const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require : true,
        unique : true
    },
    fullName : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
        minlength : 6, 
    },
    profilePic : {
        type : String,
        default : "",
    }, 
},{timestamps : true})

const USER = mongoose.model('USER',userSchema)

module.exports = USER