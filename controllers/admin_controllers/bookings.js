const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const {Bookings} = require('../../models/bookings')


const getAllBookings = async (req,res) => {
    
    const bookings = await Bookings.find()
    return res.status(200).json({message:"All Bookings", data:{bookings}})
}


module.exports = {
    getAllBookings
};












