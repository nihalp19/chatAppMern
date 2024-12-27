import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set,get) => ({
    messades : [],
    users : [],
    seletedUser : null,
    isUserLoading : false,
    isMessagesLoading : false,
    onlineUsers : [],


    setSelectedUser : (user) => set({seletedUser}),

    getUsers : async () => {
        set({isUserLoading : true})
        try{
            const res = await axiosInstance.get("messages/users")
            set({users: res.data})
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isUserLoading : false})
        }
    },

    getMessages : async(userId) => {
        set({isMessagesLoading : true})
        try{
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages : res.data})
        }catch(error){
            toast.error(error.response.data.messages)
        }finally{
            set({isMessagesLoading : false})
        }
    },

    sentMessages : async(messageData) => {
        const {seletedUser,messages} = get()
        try{
            const res = await axiosInstance.post(`/messages/send/${seletedUser._id}`,messageData)
            set({messages : [...messages,res.data]})
        }catch(error){
            toast.error(error.response.data.message)
        }
    }
}))