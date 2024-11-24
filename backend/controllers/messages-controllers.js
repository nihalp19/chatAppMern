const message = require("../models/message")
const USER = require("../models/user")
const {cloudinary} = require("../lib/cloudinary")
async function getUsersForSideBar(req, res) {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await USER.find({ _id: { $ne: loggedInUserId } }).select("-password")
        return res.status(200).json(filteredUsers)
    } catch (err) {
        console.log("Error in getUsersFOrSideBar :", err.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function getMessages(req,res) {
    try{
        const {id : userToChatId} = req.params
        const myId = req.user._id

        const messages = await message.find({
            $or : [
                {senderId:myId,receiverId : userToChatId},
                {sendId : userToChatId, receiverId : myId}
            ]
        })

        res.status(200).json(messages)
    }catch(err){
        console.log("Error in getMessages controllers",err.message)
        res.status(500).json({err : "Internal server errror"})
    }
}

async function sendMessages(req,res){
     try{
        const {text,image} = req.body
        const {id : receiverId} = req.params
        const senderId = req.user._id 

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new message({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })

        await newMessage.save();
        res.status(200).json(newMessage)
     }catch(error){{
        console.log("Error in sendMessage controllers",error.message)
        res.status(500).json({error : "Internal server error"})
     }}
}

module.exports = {
    getUsersForSideBar,
    getMessages,
    sendMessages
}