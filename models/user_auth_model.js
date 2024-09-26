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
    number_verified:{
        type: Boolean,
        default: false,
        required:false
    },
    email_verified:{
        type: Boolean,
        default: false,
        required:false
    },
    email_notifications:{
        type: Boolean,
        default: false,
        required:false
    },
    number_notifications:{
        type: Boolean,
        default: false,
        required:false
    },
    transmission:{
        type: Boolean,
        required:false
    },
    driving_license: {
        type: String,
        required: false
    },
    id_card: {
        type: String,
        required: false
    },
    insurance_card: {
        type: String,
        required: false
    },
    registration_card: {
        type: String,
        required: false
    },
    kyc:{
        type: String,
        enum:['Idle','Pending','Completed'],
        default:'Idle',
        required:true
    },
    status: {
        type: String,
        enum:['Approved','Requested','Decline','Deleted'],
        required:true
    },



          
}, { timestamps: true }
))


module.exports = { User_Auth_Schema }
