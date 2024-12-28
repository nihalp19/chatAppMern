import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";



export const useChatStore = create((set,get) => ({
    messages : [],
    users : [],
    selectedUser : null,
    isUserLoading : false,
    isMessagesLoading : false,
    
    

    setSelectedUser : (user) => {set({selectedUser : user})},

    getUsers : async () => {
        set({isUserLoading : true})
        try{
            const res = await axiosInstance.get("messages/users")
            set({users: res.data.user})
        }catch(error){
            console.log(error.response.data)
            toast.error(error.response.data.message)
        }finally{
            set({isUserLoading : false})
        }
    },

    getMessages : async(userId) => {
        set({isMessagesLoading : true})
        try{
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages : res.data.messages})
        }catch(error){
            console.log(error.response.data)
            toast.error(error.response.data.messages)
        }finally{
            set({isMessagesLoading : false})
        }
    },

    sentMessages : async(messageData) => {
        const {selectedUser,messages} = get()
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages : [...messages,res.data.messages]})
        }catch(error){
            console.log(error.response.data)
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages : () => {
        const{selectedUser} = get()
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket


        socket.on("newMessage",(newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if(!isMessageSentFromSelectedUser) return
            set({messages : [...get().messages,newMessage]})
        })
    },

    unsubscribeFromMessages : () => {
        const socket = useAuthStore.getState().socket

        socket.off("newMessage")
    }
}))