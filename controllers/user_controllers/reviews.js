const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const {Bookings} = require('../../models/bookings')
const {Reviews} = require("../../models/reviews")

const addReview = async (req,res) => {
    const {user_id} = req
    const {booking_id, remarks , rating} = req.body;
    try {
        let booking = await Bookings.findOne({_id:booking_id})
        console.log(booking)
        const review = new  Reviews({
            user_id:user_id,
            booking_id:booking_id,
            host_id: booking.host_id,
            trailer_id:booking.trailer_id,
            remarks:remarks,
            rating:rating
        })
        await review.save()
        res.status(200).json({message:"Review Added Successfully", review:review})


        
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}


module.exports = {
    addReview
};
