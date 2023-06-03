const Booking = require('../model/Booking');
const Hall = require('../model/Hall')


const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        if (!bookings || bookings.length === 0) {
            return res.status(204).json({ message: 'No bookings found.' });
        }

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

        res.json(formattedBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
};






module.exports = {
    getAllBookings
}