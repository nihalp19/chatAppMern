import { getReceiverSocketId, io } from "../lib/socket.js"
import message from "../models/message-model.js"
import USER from "../models/user-models.js"
import cloudnairy from "../lib/cloudnairy.js"

export const getUsersForSidebar = async (req,res) => {
    try{
        const loggedInUserId = req.user._id
        const filteredUsers = await USER.find({_id :{$ne :loggedInUserId}}).select("-password")

        return res.status(200).json({success : true,message : "User Filtered",user : filteredUsers})
    }catch(error){
        console.log("Error in getUsersForSideBar",error.message)
        res.status(500).json({error : "InterNal server error"})
    }
}

export const getMessages = async(req,res) => {
    try{
        const {id:userToChatId} = req.params
        const myId = req.user._id;

        const messages = await message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId : userToChatId,receiverId : myId}
            ]
        })


        return res.status(200).json({success : true,message : "fetched messages successfully",messages : messages})
    }catch(error){
        console.log("Error while fetching messages",error.message)
        return res.status(500).json({success : false,message : "Internal Server Error",error:error.message})
    }
}

export const sendMessages = async(req,res) => {
    try{
        const {text,image} = req.body
        const {id : receiverId} = req.params
        const senderId = req.user._id
        let imageUrl
        if(image){
            const uploadResponse = await cloudnairy.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new message({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })

        await newMessage.save()
        //todo

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        return res.status(201).json({success : true,message : "message send successfully",messages : newMessage})
    }catch(error){
        console.log("Error in sendMessage controllers",error.message)
        return res.status(200).json({success : false,message : "Internal server Error",error: error.message})
    }
}