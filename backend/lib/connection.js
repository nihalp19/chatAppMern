const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const connectDB = async() => {
    return mongoose.connect(process.env.MONGODB_CONNECTION_URI)
} 

module.exports = {
    connectDB
}