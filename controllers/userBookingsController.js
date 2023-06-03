const Booking = require('../model/Booking'); // Assuming the booking model is defined in a separate file
const Hall = require('../model/Hall'); // Assuming the booking model is defined in a separate file

// Request handler function
const getUserBookings = async (req, res) => {
    try {
        const userEmail = req.params.email; // Assuming the email is part of the URL parameters

        // Find bookings with the provided email
        const bookings = await Booking.find({ email: userEmail });

        const formattedBookings = await Promise.all(bookings.map(async (booking) => {
            const hall = await Hall.findOne({ _id: booking.hallid }).exec();
            const date = booking.date.toISOString().split('T')[0];
            const startTime = booking.starttime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return {
                id: booking._id,
                description: booking.description,
                hallname: hall ? hall.hallname : 'Unknown',
                date: date,
                starttime: startTime
            };
        }));

        res.json(formattedBookings); // Return the bookings as JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getUserBookings };
