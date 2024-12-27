import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,


    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check")
            set({ authUser: res.data.user })
            console.log(res.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data.user })
            toast.success(res.data.message)
        } catch (error) {
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
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoggingUp: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: res.data.user })
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message)
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
    }

})) 