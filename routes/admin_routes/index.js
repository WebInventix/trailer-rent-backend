const express = require("express");
const { userListing, userDetailsById, approveUser } = require('../../controllers/admin_controllers/index');


const router = express.Router();
router.get('/user-listing', userListing);
router.get('/user-listing/:role', userListing);
router.get('/user-detail/:id', userDetailsById);
router.post('/user-approve',approveUser )




module.exports = router;