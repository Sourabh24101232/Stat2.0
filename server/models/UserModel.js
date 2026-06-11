import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["owner", "user"], default: "user" },
    image: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: "" },
    otpExpires: { type: Date },
    resetOtp: { type: String, default: "" },
    resetOtpExpires: { type: Date },
    googleId: { type: String, default: "" },
    authProvider: { type: String, enum: ["local", "google", "both"], default: "local" },
}, { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
