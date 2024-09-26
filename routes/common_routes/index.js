const express = require('express');
const { check_auth_controller, renew_token_controller, logout_controller, verfiyUser, resendCodes, kycVerification } = require('../../controllers/auth_controllers');
const router = express.Router()



router.get('/check-auth', check_auth_controller)
router.post('/renew-token', renew_token_controller)
router.post('/logout', logout_controller)
router.post('/code-verification', verfiyUser)
router.get('/resend-codes', resendCodes)
router.post('/kyc-verification',kycVerification)





module.exports = router