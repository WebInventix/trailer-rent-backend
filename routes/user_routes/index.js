const express = require("express");
const Bookings = require('../../controllers/user_controllers/bookings')
const Reviews = require("../../controllers/user_controllers/reviews")

const router = express.Router();


router.post('/book-a-trailer',  Bookings.bookingConfirm);
router.get('/bookings', Bookings.getBookings);
router.get('/booking-history', Bookings.history)
router.post('/complete-booking',Bookings.completeBooking)
router.get('/view-booking/:id',Bookings.getBookingById)
router.get('/my-chat-users',Bookings.getChatUsers)
router.post('/add-review',Reviews.addReview)
// router.post('/reset-password',  resetPassword);




module.exports = router;
