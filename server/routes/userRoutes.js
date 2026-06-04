import express from "express"
import { getUserData, loginUser, registerUser } from "../Controllers/userController.js"
import { protect } from "../middleware/auth.js"

//create userRouter
const userRouter=express.Router()

//RouterName.method('/route',middleware(optional),route handler function )
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/data',protect,getUserData)

export default userRouter