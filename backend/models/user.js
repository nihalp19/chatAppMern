const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        require : true,
    },
    password : {
        type : String,
        require: true,
    },
    profilePic : {
        type : String,
        default : ""
    }
},{timestamps : true})

const USER = mongoose.model("Users",UserSchema)

module.exports = USER