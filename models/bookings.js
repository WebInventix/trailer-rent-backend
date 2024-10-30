const mongoose = require('mongoose');

const { Schema } = mongoose;
const Bookings = mongoose.model('bookings', new Schema({
    user_id: {
        type: String,
        required: true,
        ref:'users'
    },
    host_id: {
        type: String,
        required: true,
        ref:'users'
    },
    trailer_id: {
        type: String,
        required: true,
        ref:'trailers'
    },
    start_date:{
        type: Date,
        required: true
    },
    end_date:{
        type: Date,
        required: true
    },
    pickup_or_delivery:{
        type: String,
        required: true,
        enum: ['Pickup', 'Delivery']
    },
    time:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: false,
    },
    booking_type:{
        type: String,
        required: true,
        enum: ['Daily', 'Weekly', 'Monthly']
    },
    booking_amount:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum:['In-Process','Confirmed','Completed','Rejected'],
        required:true
    },


          
}, { timestamps: true }
))


module.exports = { Bookings }
