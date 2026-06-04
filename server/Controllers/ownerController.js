import User from "../models/UserModel.js";

//controller function to change role of user
export const changeRoleToOwner = async (req, res) => {
    try {
        const id = req.user._id;
        await User.findByIdAndUpdate(id, { role: "owner" });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "Now you can list cars" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
