const express = require("express");
const {createBank,updateBank, getBanks, updateProfile, dashboard, updateBankStatus} = require("../../controllers/host_controllers/index")
const {addTrailer,getTrailerById,getTrailersByStatus,editTrailer, getAllTrailers, trailerStatusUpdate} = require("../../controllers/host_controllers/trailerController")
const myBookings = require('../../controllers/host_controllers/hostBookings')

const router = express.Router();

router.post('/add-account', createBank)
router.post('/update-bank-account/:id', updateBank)
router.get('/bank-list', getBanks)
router.get('/dashboard',dashboard)
router.post('/update-profile', updateProfile)
router.post('/add-trailer', addTrailer)
router.get('/trailers/:id', getTrailerById)
router.get('/trailers', getAllTrailers)
router.get('/trailers/status/:status', getTrailersByStatus);
router.post('/trailer/:id', editTrailer)
router.post('/trailer-status-change', trailerStatusUpdate)
router.post('/set-bank-status',  updateBankStatus)
router.get('/get-my-bookings', myBookings.getMyBookings)
router.get('/view-my-booking/:id', myBookings.viewBooking)




module.exports = router;
