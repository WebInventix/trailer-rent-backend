const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const {Bookings} = require('../../models/bookings')


const getAllBookings = async (req,res) => {
    
    try {
        const bookings = await Bookings.find().populate('user_id').populate('trailer_id')
    return res.status(200).json({message:"All Bookings", data:{bookings}})
    } catch (error) {
        return res.status(500).json({message:error.message })
        
    }

    
}

const getBookingDetail = async (req,res)=> {
    const {id} = req.params
    try {
        const booking = await Bookings.findById(id).populate('user_id').populate('trailer_id')
    return res.status(200).json({message:"Booking Details", data:{booking}})
    } catch (error) {
        return res.status(500).json({message:error.message })
    }
    
}
module.exports = {
    getAllBookings,
    getBookingDetail
};












