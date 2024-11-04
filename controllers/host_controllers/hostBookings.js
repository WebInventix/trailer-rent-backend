const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const {Bookings} = require('../../models/bookings')


const getMyBookings = async (req,res) => {
    const {user_id} = req
    try {
        const bookings = await Bookings.find({host_id:user_id}).populate('user_id').populate('trailer_id')
    return res.status(200).json({message:"All Bookings", data:{bookings}})    
    } catch (error) {
        return res.status(500).json({message:error.message})
    }


    
    
}

const viewBooking = async (req,res)=>{
    const {id} = req.params
    try {
        const booking = await Bookings.findById(id).populate('user_id').populate('trailer_id')
    return res.status(200).json({message:"Booking Details", data:{booking}})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }

    
}

const accceptRejectBooking = async (req,res) => {
    const {booking_id, status}  = req.body
    try {
        const booking = await Bookings.findByIdAndUpdate(booking_id, {status}, {new:true})
        return res.status(200).json({message:"Booking Status Updated", data:{booking}})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }

}

const getChatUsers = async (req, res) => {
    const { user_id} = req;
    try {
        // Fetch distinct user_id values where host_id matches the provided user_id
        const userIds = await Bookings.distinct("user_id", { host_id:user_id });
        const users = await User_Auth_Schema.find({ _id: { $in: userIds } });
        
        res.status(200).json({ message:'Users Fetched Succesfully!g', users });
    } catch (error) {
        console.error("Error fetching chat users:", error);
        res.status(500).json({ message: "An error occurred while fetching chat users." });
    }
};

module.exports = {
    getMyBookings,
    viewBooking,
    accceptRejectBooking,
    getChatUsers
};












