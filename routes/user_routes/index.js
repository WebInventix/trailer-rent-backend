const express = require("express");
const Bookings = require('../../controllers/user_controllers/bookings')

const router = express.Router();


router.post('/book-a-trailer',  Bookings.bookingConfirm);
router.get('/bookings', Bookings.getBookings);
// router.post('/reset-password',  resetPassword);




module.exports = router;
