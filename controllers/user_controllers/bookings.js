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
        no_of_days,
        status,
        per_day_price,
        total_price
    } = req.body;
    const {user_id} = req

    try {

        const existingBooking = await Bookings.findOne({
            trailer_id,
            $or: [
                { start_date: { $lte: end_date }, end_date: { $gte: start_date } }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({
                message: `Trailer is already booked from ${existingBooking.start_date} to ${existingBooking.end_date}.`
            });
        }


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
            no_of_days,
            per_day_price,
            total_price,
            status
        });

        // Save the booking to the database
        await newBooking.save();
        
        res.status(200).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }


}

const  getBookings = async (req, res) => {
    const { user_id } = req;
    try {
        const bookings = await Bookings.find({ user_id }).populate('user_id').populate('host_id').populate('trailer_id');
        return res.status(200).json({message:"All Bookings",data:{bookings}})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Bookings.findById(id).populate('user_id').populate('host_id').populate('trailer_id')
        return res.status(200).json({message:"Booking by id",data:{booking}})
    } catch (error) {
        return res.status(500).json({ message: error.message });
        
    }
}


const completeBooking = async (req, res) => {
    const { booking_id } = req.body; // Make sure booking_id is extracted correctly

    if (!booking_id) {
        return res.status(400).json({ error: 'Missing booking_id' });
    }

    try {
        // Find the booking by ID and update the status to 'Completed'
        const booking = await Bookings.findByIdAndUpdate(
            booking_id,
            { status: 'Completed' },
            { new: true }
        );

        // If no booking is found, return a 404 Not Found error
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Respond with a success message and the updated booking data
        return res.status(200).json({ message: "Booking Completed", data: { booking } });

    } catch (error) {
        console.error('Error completing booking:', error);
        return res.status(500).json({ error: 'Failed to complete booking' });
    }
};


const getChatUsers = async (req, res) => {
    const { user_id} = req;
    try {
        // Fetch distinct user_id values where host_id matches the provided user_id
        const userIds = await Bookings.distinct("host_id", { user_id });
        const users = await User_Auth_Schema.find({ _id: { $in: userIds } });
        
        res.status(200).json({ message:'Users Fetched Succesfully!g', users });
    } catch (error) {
        console.error("Error fetching chat users:", error);
        res.status(500).json({ message: "An error occurred while fetching chat users." });
    }
};
module.exports = {
    bookingConfirm,
    getBookings,
    completeBooking,
    getBookingById,
    getChatUsers
};
