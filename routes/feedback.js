const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');


router.route('/')
    .get( feedbackController.getAllFeedbacks)
    .post(feedbackController.createNewFeedback)
    .delete(feedbackController.deleteFeedback);
    


module.exports = router;