import express from "express"
import {
    forgotPassword,
    getUserData,
    googleAuth,
    logoutAllDevices,
    logoutUser,
    loginUser,
    registerUser,
    resendOtp,
    resetPassword,
    verifyOtp,
} from "../Controllers/userController.js"
import { protect } from "../middleware/auth.js"

//create userRouter
const userRouter=express.Router()

//RouterName.method('/route',middleware(optional),route handler function )
userRouter.post('/register',registerUser)
userRouter.post('/verify-otp',verifyOtp)
userRouter.post('/resend-otp',resendOtp)
userRouter.post('/login',loginUser)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password',resetPassword)
userRouter.post('/google-auth',googleAuth)
userRouter.post('/logout',protect,logoutUser)
userRouter.post('/logout-all-devices',protect,logoutAllDevices)
userRouter.get('/data',protect,getUserData)

export default userRouter
