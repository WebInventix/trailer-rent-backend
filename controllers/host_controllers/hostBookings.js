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



module.exports = {
    getMyBookings,
    viewBooking,
    accceptRejectBooking,
};












