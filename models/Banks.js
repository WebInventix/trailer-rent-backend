const mongoose = require('mongoose');

const { Schema } = mongoose;
const Banks = mongoose.model('banks', new Schema({
    host_id: {
        type: String,
        required: true,
        ref:'users'
    },
    account_name: {
        type: String,
        required: true,

    },
    account_number: {
        type: String,
        required:true,
    },
    first_name: {
        type: String,
        required:true,
    },
    last_name: {
        type: String,
        required:true,
    },
    routing_number: {
        type: String,
        required:true,
    },
    address_1: {
        type: String,
        required:true,
    },
    address_2: {
        type: String,
        required:true,
    },
    country:{
        type: String,
        enum:['Canada','USA'],
        required:true
    },
    state: {
        type: String,
        required:true,
    },
    city: {
        type: String,
        required:true,
    },
    postal_code: {
        type: String,
        required:true,
    },
    SSN: {
        type: String,
        required:true,
    },
    status:{
        type: String,
        enum:['Pending','Approve','Rejected'],
        required:true
    },
    is_active:{
        type:String,
        enum:['Not-Active','Active'],
        required:true,
        default:'Not-Active'
    }


          
}, { timestamps: true }
))


module.exports = { Banks }
