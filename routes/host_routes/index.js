const express = require("express");
const {createBank,updateBank, getBanks, updateProfile} = require("../../controllers/host_controllers/index")

const router = express.Router();

router.post('/add-account', createBank)
router.post('/update-bank-account/:id', updateBank)
router.get('/bank-list', getBanks)
router.post('/update-profile', updateProfile)




module.exports = router;
