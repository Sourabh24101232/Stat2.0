import User from "../models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//function to generate jwt token
const generateToken = (userId) => {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// new user registration
export const registerUser = async (req, res) => {
    try {

        // Extract user input from request body, whatever user is filling in the registration form
        const { name, email, password } = req.body;

        //if form is not filled properly by user
        if (!name || !email || !password || password.length < 8) {
            return res.json({ success: false, message: 'Fill all the fields' });
        }

        // Check if a user with the same email already exists in the database , using the email id given by user currently in form
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: 'User already exists' });
        }

        //hash the original password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({ name, email, password: hashedPassword });

        //generate jwt token , pass user_id stored in mongodb
        const token = generateToken(user._id.toString());

        //Send success response with authentication token
        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//user login
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email });// Check if user exists in database using email

        // If no user found, stop execution
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);// Compare entered password with hashed password stored in DB
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" });// If password does not match, deny login
        }

        //generate authentication token using user's ID and Secret key and give to the user to store in frontend and bring with every future requests
        const token = generateToken(user._id.toString());
        // Send success response with JWT token
        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

};