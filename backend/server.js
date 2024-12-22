import express from "express"
import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/auth-route.js"



const app = express()
const PORT = process.env.PORT ||  4000

app.get("/",(req,res) => {
    res.send("NIHAL PANDAY")
})

app.use("/api/auth",authRoutes)

app.listen(PORT,() => console.log(`SERVER STARTED ON ${PORT}`))