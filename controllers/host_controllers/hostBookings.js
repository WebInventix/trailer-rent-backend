const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const {Bookings} = require('../../models/bookings')


const getMyBookings = async (req,res) => {
    const {user_id} = req
    const bookings = await Bookings.find({host_id:user_id})
    return res.status(200).json({message:"All Bookings", data:{bookings}})
}


module.exports = {
    getMyBookings
};












