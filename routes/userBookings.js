const express = require('express');
const router = express.Router();
const { getUserBookings } = require('../controllers/userBookingsController');

// GET /bookings/:email - Retrieve bookings for a particular user
router.get('/:email', getUserBookings);

module.exports = router;
