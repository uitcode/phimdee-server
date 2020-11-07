var express = require('express');
var router = express.Router();

const userRoute = require('./admin/account.routing');

router.use('/admin/account', userRoute);

module.exports = router;