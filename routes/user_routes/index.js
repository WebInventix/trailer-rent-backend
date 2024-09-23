const express = require("express");
const { adminDashboard,addStore,approveUser,addProducts,editProduct, getProducts,singleProduct, deleteProduct } = require('../../controllers/admin_controllers/index');


const router = express.Router();


// router.post('/verify-user',  verfiyUser);
// router.post('/reset-password',  resetPassword);

router.post('/add-store', addStore)
router.post('/approve-decline-user', approveUser)
router.post('/add-product', addProducts)
router.post('/edit-product/:pid', editProduct)
router.get('/get-products',getProducts)
router.get('/get-products/:store_id',getProducts)
router.get('/single-product/:pid',singleProduct)
router.delete('/delete-product/:pid', deleteProduct)
router.get('/admin-dashboard/:store_id', adminDashboard)


module.exports = router;
