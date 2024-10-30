const express = require('express');
const { register_user, login_user, verify_reset_password_OTP, reset_user_password_request, verify_OTP_and_create_password, } = require('../../controllers/auth_controllers');
const { upload_image_contoller } = require('../../controllers/upload_files_controllers/upload_images_cont.js');
const { userTrailer, getTraById, trailerByHost } = require('../../controllers/user_controllers/index.js')
const TrailerUser = require('../../controllers/user_controllers/trailer.js')
const router = express.Router()


router.post('/register',  register_user)
router.post('/login', login_user)
router.post('/reset-password-req',  reset_user_password_request)
router.post('/reset-password-otp-verify',  verify_reset_password_OTP)
router.post('/reset-password-create',  verify_OTP_and_create_password)
router.get('/user-trailers-list',  userTrailer)
router.post('/trailer-cateogry',  TrailerUser.userTrailerbyCategory)
router.get('/single-trailer/:id', getTraById)
router.get('/trailer-by-host-id/:host_id', trailerByHost)
router.get('/get-cordinates', TrailerUser.getcordinates)




router.post('/upload-files', upload_image_contoller)
// upload-files






module.exports = router