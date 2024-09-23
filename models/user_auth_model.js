const mongoose = require('mongoose');

const { Schema } = mongoose;
const User_Auth_Schema = mongoose.model('user', new Schema({
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    phonenumber: {
        type: String,
        required: false
    },
    role:{
        type: String,
        enum:['User','Admin','Host'],
        required:true
    },
    avatar:{
        type: String,
        required:false
    },
    send_promotions:{
        type: Boolean,
        default: false,
        required:false
    },
    status: {
        type: String,
        enum:['Approved','Requested','Decline','Deleted'],
        required:true
    },



          
}, { timestamps: true }
))


module.exports = { User_Auth_Schema }
