import jwt from "jsonwebtoken";
import Session from "../models/SessionModel.js";
import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
    try {
        // Gets the JWT token from request headers.
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

        // Verifies the token signature and returns the decoded payload.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id || !decoded.sessionId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const session = await Session.findById(decoded.sessionId);
        const sessionExpired = session?.expiresAt && session.expiresAt <= new Date();
        const sessionUserMismatch = session && session.user.toString() !== decoded.id;

        if (!session || session.revoked || sessionExpired || sessionUserMismatch) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        // Never expose password or OTP hashes through protected request handlers.
        req.user = await User.findById(decoded.id).select("-password -otp -resetOtp");
        req.session = session;

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        next();
    } catch {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }
};

export const requireOwner = (req, res, next) => {
    if (req.user?.role !== "owner") {
        return res.status(403).json({ success: false, message: "Owner access required" });
    }

    next();
};
