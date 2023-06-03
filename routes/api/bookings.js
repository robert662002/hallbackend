const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/bookingController');

router.route('/')
    .get(bookingController.getAllBookings)
    .post( bookingController.NewBooking)
    .delete( bookingController.cancelBooking);

router.route('/:id')
    .get(bookingController.getBooking);

module.exports = router;