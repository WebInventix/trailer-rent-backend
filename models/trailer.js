const { required } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const Trailers = mongoose.model('trailers', new Schema({
    host_id: {
        type: String,
        required: true,
        ref:'users'
    },
    trailer_id: {
        type: String,
        required: true,

    },
    title: {
        type: String,
        required:true,
    },
    year: {
        type: String,
        required:true,
    },
    make: {
        type: String,
        required:true,
    },
    model: {
        type: String,
        required:true,
    },
    category: {
        type: [String],
        enum:['Enclosed Trailer Rentals','Dump Trailer Rentals','Flatbed Trailer Rentals','Horse Trailer Rentals', 'Motorcycle Trailer Rentals', 'Semi Trailer Rentals', 'Speciality Trailer Rentals','Utility Trailer Rentals', 'Car Hauler Trailer Rentals', 'Boat Trailer Rentals', 'Tow Dolly Trailer Rentals', 'Cargo Trailer Rental'],
        required: true,

    },
    hitch_type: {
        type: [String], 
        enum: ['Other', 'Fifth Wheel', 'Gooseneck', 'Pintle', 'Bumper Pull'],  // Enum options for hitch types
        required: true,  // Set to true if hitch_type is mandatory
    },
    ball_size: {
        type: [String],
        enum:['3 inch','2-5/16 inch','2 inch','1-7/8 inch','Pintle','Fith Wheel'],
        required: false,
    },
    title_status: {
        type:String,
        enum: ['Clean', 'Salvage', 'Restored'],
        required: false,
    },
    light_plug_configuration: {
        type:String,
        required:false
    },
    trailer_dimension: {
        type:String,
        required:false
    },
    rear_door_opening_height: {
        type:String,
        required:false
    },
    payload_capacity: {
        type:String,
        required:false
    },
    axles: {
        type:[String],
        enum:['1-2000lb','2-1x3500lb','3-1x5000lb','4-2x3500lb','5-2x5000lb','6-2x7000lb','7-2x10000lb','8-2x12000lb','9-other'],
        required:false
    },
    refundable_deposit: {
        type:String,
        required:false
    },
    tag_words: {
        type:String,
        required:false
    },
    rental_delay_max: {
        type:String,
        required:false
    },
    rental_delay_min: {
        type:String,
        required:false
    },
    trailer_length: {
        type:String,
        required:false
    },
    trailer_width: {
        type:String,
        required:false
    },
    vin: {
        type:String,
        required:false
    },
    province_territory: {
        type:String,
        required:false
    },
    city: {
        type:String,
        required:false
    },
    postal_codes: {
        type:String,
        required:false
    },
    location: {
        type:String,
        required:false
    },
    daily_rate: {
        type:String,
        required:false
    },
    monthly_rate: {
        type:String,
        required:false
    },
    weekly_rate: {
        type:String,
        required:false
    },
    trailer_photos: {
        type:[String],
        required:false
    },
    approve_status: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected'],
        default:'Pending'
    },
    status: {
        type: String,
        enum: ['Online', 'On-Rent','Offline'],
        default:'Online'

    }



          
}, { timestamps: true }
))


module.exports = { Trailers }
