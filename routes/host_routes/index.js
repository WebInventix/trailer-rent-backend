const express = require("express");
const {createBank,updateBank, getBanks, updateProfile} = require("../../controllers/host_controllers/index")
const {addTrailer,getTrailerById,getTrailersByStatus,editTrailer} = require("../../controllers/host_controllers/trailerController")

const router = express.Router();

router.post('/add-account', createBank)
router.post('/update-bank-account/:id', updateBank)
router.get('/bank-list', getBanks)
router.post('/update-profile', updateProfile)
router.post('/add-trailer', addTrailer)
router.get('/trailers/:id', getTrailerById)
router.get('/trailers/status/:status', getTrailersByStatus);




module.exports = router;
