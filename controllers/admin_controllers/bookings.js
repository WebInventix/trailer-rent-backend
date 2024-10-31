const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const {Bookings} = require('../../models/bookings')


const getAllBookings = async (req,res) => {
    
    const bookings = await Bookings.find().populate('user_id').populate('trailer_id')
    return res.status(200).json({message:"All Bookings", data:{bookings}})
}

const getBookingDetail = async (req,res)=> {
    const {id} = req.params
    const booking = await Bookings.findById(id).populate('user_id').populate('trailer_id')
    return res.status(200).json({message:"Booking Details", data:{booking}})
}
module.exports = {
    getAllBookings,
    getBookingDetail
};












