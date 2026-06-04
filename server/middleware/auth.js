import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
    try {

        //Gets the JWT token from request headers.
        const token = req.headers.authorization;
        if (!token) {
            return res.json({ success: false, message: "not authorized" });
        }

        //Verifies the token signature and returns the decoded payload.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Finds the user in the database(decoded.id=MongoDB user's _id) and Stores the user in req.user.
        //By default, MongoDB returns all fields But .select("-password") means: Return everything except the password field.
        req.user = await User.findById(decoded.id).select("-password");

        //passes control to the next middleware/controller
        next();

    } catch (error) {
        return res.json({
            success: false,
            message: "not authorized"
        });
    }
};