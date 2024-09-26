const mongoose = require('mongoose');
const crypto = require('crypto');
const { User_Auth_Schema } = require("../../models/user_auth_model");





const generateUniquePid = () => {
    const uniqueId = crypto.randomBytes(3).toString('hex'); // Generates a random 6-character hex string
    return `PID${uniqueId}`;
};


const userListing = async (req,res) => {
    const {role} = req.params
    
    try {
        let user;
        if(!role)
        {
            user = await User_Auth_Schema.find().select("-password");
        }
        else
        {
            user = await User_Auth_Schema.find({role:role}).select("-password")
        }
        
        res.json(user);

        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}
const userDetailsById = async (req, res) => {
    try {
        const { id } = req.params;  // Get the user ID from the request parameters
        const user = await User_Auth_Schema.findById(id).select("-password");  // Fetch the user by ID, excluding the password field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const approveUser = async (req,res) => {
    const {userId, status} =req.body
    try {
        const user = await User_Auth_Schema.findById(userId)
        if(!user) {
            return res.status(404).json({ message: "User not found" });
            }
            user.status = status
            await user.save()
            res.json({message:'Status Updated', user})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}

module.exports = {
    userListing,
    userDetailsById,
    approveUser
};
