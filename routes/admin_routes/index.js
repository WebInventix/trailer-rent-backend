const express = require("express");
const { userListing, userDetailsById } = require('../../controllers/admin_controllers/index');


const router = express.Router();
router.get('/user-listing', userListing);
router.get('/user-detail/:id', userDetailsById);





module.exports = router;
