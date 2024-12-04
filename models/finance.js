const { required } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const Finance = mongoose.model('finance', new Schema({
    host_id: {
        type: String,
        required: true,
        ref:'user'
    },
    booking_id: {
        type: String,
        required: true,
        ref:'bookings'
    },
    host_price:{
        type: Number,
        required:false
    },
    amount:{
        type: Number,
        required: true
    },
    bambora_response:{
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    status:{
        type: String,
        enum:['In-Queue','Paid'],
        required:true
    },


          
}, { timestamps: true }
))


module.exports = { Finance }
