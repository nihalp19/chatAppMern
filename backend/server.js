import express from "express"
import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/auth-route.js"
import connectDB from "./db/connectDB.js"


const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`SERVER STARTED ON ${PORT}`)
})