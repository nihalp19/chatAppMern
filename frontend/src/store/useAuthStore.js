import { create } from "zustand";
import { axiosInstance } from "../lib/axios";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,


    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check")
            if (!res.ok) {
                const data = await res.json()
                console.log(`${res.status} || ${data.response} || ${data.message}`)
            }
            set({ authUser: res.user })
        } catch (error) {
            console.log("Error in checkAuth", error.message)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        try {
            const res = await axiosInstance.post({})
        }catch(error){

        }finally{
            
        }
    }

})) 