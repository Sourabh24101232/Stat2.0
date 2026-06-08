import jwt from "jsonwebtoken";
import Session from "../models/SessionModel.js";
import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
    try {

        //Gets the JWT token from request headers.
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.json({ success: false, message: "not authorized" });
        }
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

        //Verifies the token signature and returns the decoded payload.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.sessionId) {
            return res.json({ success: false, message: "not authorized" });
        }

        const session = await Session.findById(decoded.sessionId);
        if (!session || session.revoked) {
            return res.json({ success: false, message: "not authorized" });
        }

        //Finds the user in the database(decoded.id=MongoDB user's _id) and Stores the user in req.user.
        //By default, MongoDB returns all fields But .select("-password") means: Return everything except the password field.
        req.user = await User.findById(decoded.id).select("-password");
        req.session = session;

        if (!req.user) {
            return res.json({ success: false, message: "not authorized" });
        }

        //passes control to the next middleware/controller
        next();

    } catch (error) {
        return res.json({
            success: false,
            message: "not authorized"
        });
    }
};
