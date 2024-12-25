import express from "express"
import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/auth-route.js"
import messageRoutes from "./routes/message-route.js"
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser"

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("apoi/message",messageRoutes)


app.listen(PORT, () => {
    connectDB()
    console.log(`SERVER STARTED ON ${PORT}`)
})