const mongoose = require('mongoose');

const { Schema } = mongoose;
const Verifications = mongoose.model('verifications', new Schema({
    user_id: {
        type: String,
        required: true,
        ref:'users'
    },
    type: {
        type: String,
        enum:['Email','Number'],
        required: true,

    },
    code: {
        type: String,
        required:true,
    }


          
}, { timestamps: true }
))


module.exports = { Verifications }
