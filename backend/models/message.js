const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    sendId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    text : {
        type : String,
    },
    image : {
        type : String
    }
},{timestamps: true})

const message = mongoose.model("message",messageSchema)

module.exports = message