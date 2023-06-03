const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');

router.post('/', filterController.getAvailableHalls);

module.exports = router;