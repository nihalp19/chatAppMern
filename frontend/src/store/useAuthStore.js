import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"


const BASE_URL = "http://localhost:4000"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    isCheckingAuth: true,

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data.user })
            get().connectSocket()
            toast.success(res.data.message)
        } catch (error) {
            console.log(error.response.data)
            toast.error(error.response?.data?.message);
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingUp: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data.user })
            get().connectSocket()
            toast.success(res.data.message)
        } catch (error) {
            console.log(error.response.data)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoggingUp: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: res.data.user })
            get().disconnectSocket()
            toast.success(res.data.message)
        } catch (error) {
            console.log(error.response.data)
            toast.error(error.response?.data?.message)
        }
    },

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check")
            set({ authUser: res.data.user })
            get().connectSocket()
            console.log(res.data.message)
        } catch (error) {
            console.log(error.response.data)
            toast.error(error.response.data.message)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("auth/update-profile", data)
            set({ authUser: res.data.user })
            toast.success(res.data.message)
        } catch (error) {
            console.log(error.response.data)
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query : {
                userId : authUser._id,
            }
        })
        socket.connect()
        set({socket : socket})
        
        

        socket.on("getOnlineUsers",(userIds) => {
            set({onlineUsers : userIds})
            
            
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect()
    }

})) 