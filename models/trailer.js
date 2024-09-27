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
        type: String,
        enum:['Enclosed Trailer Rentals','Dump Trailer Rentals','Flatbed Trailer Rentals','Horse Trailer Rentals', 'Motorcycle Trailer Rentals', 'Semi Trailer Rentals', 'Speciality Trailer Rentals','Utility Trailer Rentals', 'Car Hauler Trailer Rentals', 'Boat Trailer Rentals', 'Tow Dolly Trailer Rentals', 'Cargo Trailer Rental'],
        required: true,

    },
    hitch_type: {
        type: [String],  // Array of strings for hitch types
        enum: ['Ball Hitch', 'Fifth Wheel', 'Gooseneck', 'Pintle Hook', 'Bumper Pull', 'Weight Distribution Hitch'],  // Enum options for hitch types
        required: true,  // Set to true if hitch_type is mandatory
        default: []      // Default to an empty array if no hitch types are provided
    }


          
}, { timestamps: true }
))


module.exports = { Trailers }
