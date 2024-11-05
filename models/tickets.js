const mongoose = require('mongoose');

const { Schema } = mongoose;


const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    commented_by: {
        type: Schema.Types.ObjectId,
        ref: 'user',  // Reference to the user who made the comment
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});



const Tickets = mongoose.model('tickets', new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    query: {
        type: String,
        required: true,

    },
    attachment: {
        type: String,
        required:false,
    },
    comments: [commentSchema], 
    status:{
        type: String,
        enum:['Pending','Approve','Rejected'],
        required:true
    }


          
}, { timestamps: true }
))


module.exports = { Tickets }
