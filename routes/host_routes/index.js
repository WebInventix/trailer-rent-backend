const express = require("express");
const {createBank,updateBank, getBanks} = require("../../controllers/host_controllers/index")

const router = express.Router();

router.post('/add-account', createBank)
router.post('/update-bank-account/:id', updateBank)
router.get('/bank-list', getBanks)





module.exports = router;
