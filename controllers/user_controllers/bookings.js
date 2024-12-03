const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Trailers } = require("../../models/trailer")
const {Bookings} = require('../../models/bookings')
const {Reviews} =  require('../../models/reviews')
const axios = require('axios');

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
        card_name,
        card_number,
        cvd,
        exp_year,
        exp_month
    } = req.body;
    const {user_id} = req

    try {
      //  let base64Auth = "MzgzNjEyODQ0OjhmQTdlMzg5MkJDZDQ1NkU4NTUyMWYwRjc4QzM0NTY4";  // Test Keys
        let base64Auth = "Mzg3MTk0MjM4OjAyOEE2NUNkMEEwOTQ5YTA4OGE0NTVGQ0Q1NzdjNWYx"; // Live Keys
        const paymentData = {
            amount: parseFloat(booking_amount), // Amount to charge
            payment_method: 'card',
            currency: 'CAD', // Currency in ISO 4217 format
            card: {
                name: card_name,
                number: card_number,
                expiry_month: exp_month,
                expiry_year: exp_year,
                cvd: cvd
            },
            billing: {
                address_line1: "123 Test Street", // Replace with actual billing address
                address_line2: "Suite 456", // Optional
                city: "Test City",
                province: "ON",
                postal_code: "A1A 1A1",
                country: "CA"
            }
        };

          
          
        //   console.log(bamboora.data)
        //   // Return the Bambora API response
        //  return res.json({
        //     success: true,
        //     data: bamboora.data
        //   });



        const existingBooking = await Bookings.findOne({
            trailer_id,
            $or: [
                { 
                    start_date: { $lte: end_date }, 
                    end_date: { $gte: start_date } 
                }
            ],
            status:'Confirmed'
        });

        if (existingBooking) {
            return res.status(400).json({
                message: `Trailer is already booked from ${existingBooking.start_date} to ${existingBooking.end_date}.`
            });
        }

        const bamboora = await axios.post('https://api.na.bambora.com/v1/payments', paymentData, {
            headers: {
              'Authorization': `Passcode ${base64Auth}`,
              'Content-Type': 'application/json'
            }
          });

          let host_price = booking_amount * 0.80;
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
            host_price,
            status,
            bambora_response:bamboora.data
        });

        // Save the booking to the database
        await newBooking.save();
        
        res.status(200).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        if (error.response) {
            // Bambora returned a response with a status code that falls out of the range of 2xx
            const statusCode = error.response.status;
            const errorMessage = error.response.data?.message || "An error occurred";
            const errorDetails = error.response.data || {};
    
            console.error("Bambora API Error:", errorDetails); // Log detailed error for debugging
    
            return res.status(statusCode).json({
                success: false,
                message: errorMessage,
                details: errorDetails,
            });
        } else if (error.request) {
            // No response was received from Bambora
            console.error("No response from Bambora:", error.request);
    
            return res.status(500).json({
                success: false,
                message: "No response from payment gateway.",
            });
        } else {
            // Something else happened while setting up the request
            console.error("Error in setting up request:", error.message);
    
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
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
    const {user_id} = req
    const { id } = req.params;
    try {
        const booking = await Bookings.findById(id).populate('user_id').populate('host_id').populate('trailer_id')
        // console.log(booking)
        const reviews = await Reviews.find({trailer_id:booking.trailer_id._id}).populate('user_id').populate('host_id')
        let user_review= false
        reviews.forEach(review => {
            if(review.user_id.toString() === user_id){
            user_review = true;
            }
        })
        return res.status(200).json({message:"Booking Details",data:{booking,user_review,reviews}})
        // return res.status(200).json({message:"Booking by id",data:{booking}})
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


const history = async (req,res) => {
    const { user_id } = req;
    try {
        const bookings = await Bookings.find({ user_id,status:"Completed" });
        return res.status(200).json({ message: "Booking History Fetched Succesfully!", bookings})
        
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    bookingConfirm,
    getBookings,
    completeBooking,
    getBookingById,
    getChatUsers,
    history
};
