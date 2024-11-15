const mongoose = require('mongoose');

const { Schema } = mongoose;
const Reviews = mongoose.model('reviews', new Schema({
    user_id: {
        type: String,
        required: true,
        ref:'user'
    },
    booking_id: {
        type: String,
        required: true,
        ref:'bookings'
    },
    host_id: {
        type: String,
        required: true,
        ref:'user'
    },
    trailer_id: {
        type: String,
        required: true,
        ref:'trailers'
    },
    rating: {
        type: Number,
        required:true,
    },
    remarks: {
        type: String,
        required:true,
    },


          
}, { timestamps: true }
))


module.exports = { Reviews }
