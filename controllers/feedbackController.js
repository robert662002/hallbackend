const Feedback = require('../model/Feedback');

const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();

        if (feedbacks.length === 0) {
            return res.status(204).json({ 'message': 'No feedbacks found.' });
        }

        // Extract the date part from each feedback and remove the time component
        const formattedFeedbacks = feedbacks.map(feedback => ({
            content: feedback.content,
            date: feedback.date.toISOString().split('T')[0],
            _id :feedback._id// Extract the date part
        }));

        res.json(formattedFeedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}

const createNewFeedback = async (req, res) => {
    if (!req?.body?.content) {
        return res.status(400).json({ 'message': 'Content is required' });
    }

    try {
        let feedbackDate;
        if (req.body.date) {
            feedbackDate = new Date(req.body.date);
            if (isNaN(feedbackDate)) {
                return res.status(400).json({ 'message': 'Invalid date format' });
            }
        }

        const result = await Feedback.create({
            content: req.body.content,
            date: feedbackDate || undefined
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}

const deleteFeedback = async (req, res) => {
    const feedbackId = req.body.id; // Assuming the feedback ID is passed in the request body
    console.log(`feedback ${feedbackId}`)
    try {
        if (!feedbackId) {
            return res.status(400).json({ 'message': 'Feedback ID is required' });
        }

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ 'message': 'Feedback not found' });
        }

        const deleted = await Feedback.findByIdAndDelete(feedbackId);
        res.status(200).json({ 'message': 'Feedback deleted successfully', deleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}

module.exports = {
    getAllFeedbacks,
    createNewFeedback,
    deleteFeedback
}
