const express = require('express');
const router = express.Router()

const public_routes = require('./public_routes/index')
const user_routes = require('./user_routes/index');
const common_routes = require('./common_routes/index');
const host_routes = require('./host_routes/index')
const admin_routes= require('./admin_routes/index')
const check_user_auth = require('../middlewares/check_user_auth');
const {checkAdmin,checkHost,checkUser} = require('../middlewares/roleMiddleware');



router.use('/', public_routes)

router.use(check_user_auth)

router.use('/', common_routes)
router.use('/user', checkUser, user_routes)
router.use('/admin', checkAdmin, admin_routes)
router.use('/host', checkHost, host_routes)




module.exports = router