const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const {Bookings} = require('../../models/bookings')

const bookingConfirm  = async (req,res) => {
    const {
        host_id,
        trailer_id,
        start_date,
        end_date,
        pickup_or_delivery,
        time,
        address,
        booking_type,
        booking_amount,
        status
    } = req.body;
    const {user_id} = req

    try {
        // Create a new booking with the provided data
        const newBooking = new Bookings({
            user_id,
            host_id,
            trailer_id,
            start_date,
            end_date,
            pickup_or_delivery,
            time,
            address,
            booking_type,
            booking_amount,
            status
        });

        // Save the booking to the database
        await newBooking.save();
        
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }


}


module.exports = {
    bookingConfirm
};
