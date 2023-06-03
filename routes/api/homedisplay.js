const express = require('express');
const router = express.Router();
const homeDisplayController = require('../../controllers/homedisplaycontroller');

router.route('/')
    .get(homeDisplayController.getAllBookings)

module.exports = router;