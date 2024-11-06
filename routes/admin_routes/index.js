const express = require("express");
const { userListing, userDetailsById, approveUser, getTrailer, trailerByID, trailerByHostId } = require('../../controllers/admin_controllers/index');
const adminBookings = require('../../controllers/admin_controllers/bookings')
const tickets = require('../../controllers/host_controllers/tickets')

const router = express.Router();
router.get('/user-listing', userListing);
router.get('/user-listing/:role', userListing);
router.get('/user-detail/:id', userDetailsById);
router.post('/user-approve',approveUser )
router.get('/trailer-get',getTrailer)
router.get('/trailer/:id', trailerByID)
router.get('/trailer/host/:id', trailerByHostId)
router.get('/get-all-bookings', adminBookings.getAllBookings)
router.get('/booking-detail/:id',  adminBookings.getBookingDetail)
router.get('/get-tickets', tickets.getTickets)
router.get('/view-ticket/:ticket_id', tickets.viewTicket)
router.post('/add-comment', tickets.addComment)
router.post('/update-ticket-status/:ticket_id', tickets.updateStatus)




module.exports = router;
