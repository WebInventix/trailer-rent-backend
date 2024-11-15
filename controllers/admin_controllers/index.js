const mongoose = require('mongoose');
const crypto = require('crypto');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers  } = require("../../models/trailer");




const generateUniquePid = () => {
    const uniqueId = crypto.randomBytes(3).toString('hex'); // Generates a random 6-character hex string
    return `PID${uniqueId}`;
};


const getTrailer = async (req,res ) => {
    try {
        let trailers = await Trailers.find().populate('host_id')
        return res.status(200).json({message:"Listing",trailers:trailers})
    } catch (error) {
        return res.status(500).json({message:"Error",error:error.message})
    }
}

const trailerByID = async (req,res) => {
    const {id} = req.params
    try {
        let trailer = await Trailers.findById(id).populate('host_id')
        if(!trailer) { return res.status(404).json({message:"Trailer not found"}) }
        return res.status(200).json({message:"Trailer found",trailer:trailer})

    }
    catch (error) {
        return res.status(500).json({message:"Error",error:error.message})
    }
}

const trailerByHostId = async(req,res)=> {
    const {id} = req.params
    try {
        let host = await User_Auth_Schema.findById(id).select("-password")
        let trailer = await Trailers.find({host_id:id}).populate('host_id')
        if(!trailer) { return res.status(404).json({message:"Trailer not"})}
        return res.status(200).json({message:"Trailer found",trailer:trailer,host:host})
        }
        catch (error) {
            return res.status(500).json({message:"Error",error:error.message})
            }
}

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

const getStates = (req,res) =>{
    const canadianProvincesAndTerritories = [
        { name: "Alberta", code: "AB" },
        { name: "British Columbia", code: "BC" },
        { name: "Manitoba", code: "MB" },
        { name: "New Brunswick", code: "NB" },
        { name: "Newfoundland and Labrador", code: "NL" },
        { name: "Northwest Territories", code: "NT" },
        { name: "Nova Scotia", code: "NS" },
        { name: "Nunavut", code: "NU" },
        { name: "Ontario", code: "ON" },
        { name: "Prince Edward Island", code: "PE" },
        { name: "Quebec", code: "QC" },
        { name: "Saskatchewan", code: "SK" },
        { name: "Yukon", code: "YT" }
      ];

      return res.status(200).json({message:'States',states:canadianProvincesAndTerritories})
}

module.exports = {
    userListing,
    userDetailsById,
    approveUser,
    getTrailer,
    trailerByID,
    trailerByHostId,
    getStates
};
