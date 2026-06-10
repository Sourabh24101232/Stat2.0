import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Session from "../models/SessionModel.js";
import User from "../models/UserModel.js";
import Car from '../models/CarModel.js'

const OTP_EXPIRY_MINUTES = 10;

// Creates a JWT that the frontend stores and sends with protected requests.
// The sessionId lets the backend revoke one device or all devices later.
const generateToken = (userId, sessionId) => {
    return jwt.sign({ id: userId, sessionId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Creates one login session for the current browser/device.
const createSession = async (userId, req) => {
    return Session.create({
        user: userId,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "",
    });
};

// Creates a 6 digit OTP for email verification and password reset.
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTPs stay valid only for a short time for better security.
const getOtpExpiry = () => {
    return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

// Sends OTP emails using Gmail OAuth2 credentials from backend .env.
const sendOtp = async (email, otp, purpose) => {
    if (!process.env.GOOGLE_USER || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
        throw new Error("Google email env variables are missing");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
    });

    await transporter.sendMail({
        from: `Stat <${process.env.GOOGLE_USER}>`,
        to: email,
        subject: `${purpose} OTP`,
        text: `Your ${purpose.toLowerCase()} OTP is ${otp}. This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>${purpose}</h2>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
            </div>
        `,
    });
};

// Keeps email comparisons consistent, so Test@Mail.com and test@mail.com match.
const normalizeEmail = (email = "") => email.trim().toLowerCase();

// Store OTPs as hashes so raw OTP values are not saved in MongoDB.
const hashOtp = async (otp) => bcrypt.hash(otp, 10);

// Compares the user-entered OTP with the hashed OTP saved in MongoDB.
const isOtpMatch = async (otp, otpHash) => bcrypt.compare(otp, otpHash);

// Sends only safe user fields back to the frontend.
// Passwords and OTPs are intentionally never included here.
const userPayload = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    isVerified: user.isVerified,
    authProvider: user.authProvider,
});

// Register flow:
// 1. Validate name, email and password.
// 2. Create an unverified user.
// 3. Generate and store a hashed OTP.
// 4. Send/log the OTP so the user can verify their email.
export const registerUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        const email = normalizeEmail(req.body.email);

        // Basic validation before touching the database.
        if (!name || !email || !password || password.length < 8) {
            return res.json({ success: false, message: "Fill all the fields. Password must be at least 8 characters." });
        }

        // Do not allow two accounts with the same email.
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Password is hashed before saving, and the user starts as unverified.
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            otp: await hashOtp(otp),
            otpExpires: getOtpExpiry(),
            authProvider: "local",
        });

        await sendOtp(email, otp, "Email verification");

        // No JWT is returned yet. JWT is generated only after OTP verification.
        res.json({
            success: true,
            message: "User registered. Please verify OTP sent to your email.",
            user: userPayload(user),
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Email verification flow:
// 1. Find the user by email.
// 2. Check the OTP and expiry time.
// 3. Mark the user as verified.
// 4. Return JWT token so the frontend can log the user in.
export const verifyOtp = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const { otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // If already verified, simply return a fresh token.
        if (user.isVerified) {
            const session = await createSession(user._id, req);
            const token = generateToken(user._id.toString(), session._id.toString());
            return res.json({ success: true, message: "Email already verified", token, user: userPayload(user) });
        }

        // Reject missing, expired, or incorrect OTPs.
        if (!user.otp || !user.otpExpires || user.otpExpires < new Date() || !(await isOtpMatch(otp, user.otp))) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP fields after successful verification so OTP cannot be reused.
        user.isVerified = true;
        user.otp = "";
        user.otpExpires = undefined;
        await user.save();

        const session = await createSession(user._id, req);
        const token = generateToken(user._id.toString(), session._id.toString());
        res.json({ success: true, message: "Email verified successfully", token, user: userPayload(user) });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Sends a new verification OTP when the user did not receive it
// or the previous OTP expired.
export const resendOtp = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.json({ success: false, message: "User is already verified" });
        }

        // Replace the old OTP with a fresh OTP.
        const otp = generateOtp();
        user.otp = await hashOtp(otp);
        user.otpExpires = getOtpExpiry();
        await user.save();

        await sendOtp(email, otp, "Email verification");
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Login flow:
// 1. Find user by email.
// 2. Compare password with hashed password.
// 3. Block login if email is not verified.
// 4. Return JWT token on success.
export const loginUser = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const { password } = req.body;

        // Google-only users may not have a password, so local login is blocked.
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // bcrypt compares the plain password with the stored hashed password.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.json({ success: false, message: "Please verify your email first", needsVerification: true });
        }

        // Login succeeds only after verification.
        const session = await createSession(user._id, req);
        const token = generateToken(user._id.toString(), session._id.toString());
        res.json({ success: true, token, user: userPayload(user) });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Forgot password flow:
// 1. Find verified user by email.
// 2. Generate and store a password-reset OTP.
// 3. Send/log OTP for the user.
export const forgotPassword = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.isVerified) {
            return res.json({ success: false, message: "Please verify your email first" });
        }

        // The reset OTP is separate from the email-verification OTP.
        const otp = generateOtp();
        user.resetOtp = await hashOtp(otp);
        user.resetOtpExpires = getOtpExpiry();
        await user.save();

        await sendOtp(email, otp, "Password reset");
        res.json({ success: true, message: "Password reset OTP sent successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Reset password flow:
// 1. Check email, OTP and new password.
// 2. Verify reset OTP and expiry.
// 3. Save the new hashed password.
// 4. Clear reset OTP fields.
export const resetPassword = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const { otp, password } = req.body;

        if (!email || !otp || !password || password.length < 8) {
            return res.json({ success: false, message: "Email, OTP and a password of at least 8 characters are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Reset OTP must exist, be unexpired, and match the user input.
        if (!user.resetOtp || !user.resetOtpExpires || user.resetOtpExpires < new Date() || !(await isOtpMatch(otp, user.resetOtp))) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        // Save new password securely and prevent OTP reuse.
        user.password = await bcrypt.hash(password, 10);
        user.resetOtp = "";
        user.resetOtpExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Google authentication flow:
// 1. Frontend sends Google ID token as "credential".
// 2. Backend verifies token with Google.
// 3. Existing user is linked, or a new Google user is created.
// 4. Verified Google user receives the same JWT used by normal login.
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.json({ success: false, message: "Google credential is required" });
        }

        // Validate the Google ID token by asking Google's tokeninfo endpoint.
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        const googleUser = await response.json();

        if (!response.ok || !googleUser.email) {
            return res.json({ success: false, message: "Invalid Google credential" });
        }

        // If GOOGLE_CLIENT_ID is configured, ensure the token belongs to this app.
        if (process.env.GOOGLE_CLIENT_ID && googleUser.aud !== process.env.GOOGLE_CLIENT_ID) {
            return res.json({ success: false, message: "Google credential is not for this app" });
        }

        const email = normalizeEmail(googleUser.email);
        let user = await User.findOne({ email });

        if (!user) {
            // New Google users are already verified because Google verified the email.
            user = await User.create({
                name: googleUser.name || email.split("@")[0],
                email,
                image: googleUser.picture || "",
                googleId: googleUser.sub,
                authProvider: "google",
                isVerified: true,
            });
        } else {
            // Link Google details to an existing account with the same email.
            user.googleId = user.googleId || googleUser.sub;
            user.image = user.image || googleUser.picture || "";
            user.isVerified = true;
            await user.save();
        }

        const session = await createSession(user._id, req);
        const token = generateToken(user._id.toString(), session._id.toString());
        res.json({ success: true, token, user: userPayload(user) });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Google authentication failed" });
    }
};

// Returns the currently logged-in user's data.
// The protect middleware runs before this and puts the user into req.user.
export const getUserData = async (req, res) => {
    try {
        res.json({ success: true, user: userPayload(req.user) });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Logs out only the current device by revoking the current token's session.
export const logoutUser = async (req, res) => {
    try {
        await Session.findByIdAndUpdate(req.session._id, { revoked: true });
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Logs out all devices by revoking every active session for this user.
export const logoutAllDevices = async (req, res) => {
    try {
        await Session.updateMany({ user: req.user._id, revoked: false }, { revoked: true });
        res.json({ success: true, message: "Logged out from all devices successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//get All cars for frontend
export const getCars = async (req, res) => {
    try {
        const cars=await Car.find({isAvailable:true})
        res.json({ success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}