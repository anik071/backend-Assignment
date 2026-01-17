import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv' 
import { success } from 'zod'
import userRoute from "../backend ct/routes/user.route.js"
import cookieParser from 'cookie-parser'
import eventRoute from './routes/event.route.js'
const app =express()
dotenv.config();
const port=process.env.PORT||8000

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user",userRoute);
app.use("/api/event",eventRoute);
app.listen(port,()=>{
    console.log(`Backend is running in http://localhost:${port}`)
})
app.get('/',(req,res)=>{
        res.status(200).json({
        success:true,
        message:"Welcome to our backend"
    })
})
mongoose.connect(process.env.URI)
.then(()=>{
    console.log("Database Connected Successfully")
})
.catch(()=>{
    console.log("Something went Wrong")
});
