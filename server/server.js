import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"

//initialise express app
const app=express()
//connect Database
await connectDB()

//middleware
app.use(cors())
app.use(express.json());//to send all requests in json format

//home route 
app.get('/',(req,res)=>{
    res.send("Welcome to the Home Page")
})

//start the server at port 3000
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`)
})







