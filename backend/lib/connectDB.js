const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
function connectDB(){
    return mongoose.connect(process.env.MONGODB_CONNECT_URI)
}

module.exports = {
    connectDB
}