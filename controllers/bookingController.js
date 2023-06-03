const Booking = require('../model/Booking');
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const { GMAIL, PASS } = require('../env')
const User = require('../model/User')
const Hall = require('../model/Hall')



const getAllBookings = async (req, res) => {
    const bookings = await Booking.find();
    if (!bookings) return res.status(204).json({ 'message': 'No bookings found.' });
    res.json(bookings);
}

const NewBooking = async (req, res) => {
    if (!req?.body?.email || !req?.body?.hallid || !req?.body?.date || !req?.body?.starttime || !req?.body?.endtime) {
        return res.status(400).json({ 'message': 'All fields are required' });
    }
    console.log(req.body)

    try {
        const startTimeParts = req.body.starttime.split(':');
        const startHour = parseInt(startTimeParts[0]);
        const startMinute = parseInt(startTimeParts[1]);

        const endTimeParts = req.body.endtime.split(':');
        const endHour = parseInt(endTimeParts[0]);
        const endMinute = parseInt(endTimeParts[1]);

        const startDate = new Date(req.body.date);
        startDate.setHours(startHour);
        startDate.setMinutes(startMinute);

        const endDate = new Date(req.body.date);
        endDate.setHours(endHour);
        endDate.setMinutes(endMinute);

        const result = await Booking.create({
            email: req.body.email,
            hallid: req.body.hallid,
            description: req.body.description,
            starttime: startDate,
            endtime: endDate,
            date: req.body.date
        })

        let config = {
            service: 'gmail',
            auth: {
                user: GMAIL,
                pass: PASS
            }
        }

        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: "cerberus",
            product: {
                name: "MITS HALLS.",
                link: 'https://mailgen.js/' //link of our site
            }
        })
        const user = await User.findOne({ email: req.body.email }).exec();
        const hall = await Hall.findOne({ _id: req.body.hallid }).exec();
        let response = {
            body: {
                name: user.username,
                intro1: 'epidraa...',
                intro: 'Your booking has been confirmed!',
                table: {
                    data: [
                        {
                            bookingId: result._id,
                            hallname: hall.hallname,
                            date: req.body.date
                        }
                    ],
                    columns: {
                        // Optionally, customize the column widths
                        customWidth: {
                            bookingId: '45%',
                            hallname: '45%'
                        }
                    }
                },
                outro: "Use bookingId for cancellation",
                signature: 'Thank you for choosing us:)'
            }
        }

        let mail = MailGenerator.generate(response)

        let message = {
            from: GMAIL,
            to: req.body.email,
            subject: "Booking confirmation",
            html: mail
        }

        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "you should receive an email", result
            })
        }).catch(error => {
            return res.status(500).json({ error })
        })
    }
    catch (err) {
        console.error(err);
    }

}

const cancelBooking = async (req, res) => {

    if (!req?.body?.id) return res.status(400).json({ 'message': 'Booking ID required.' });
    console.log(req.body)
    const booking = await Booking.findOne({ _id: req.body.id }).exec();
    if (!booking) {
        return res.status(404).json({ "message": `No booking matches ID ${req.body.id}.` });
    }

    const user = await User.findOne({ email: booking.email }).exec();
    const hall = await Hall.findOne({ _id: booking.hallid }).exec();

    let config = {
        service: 'gmail',
        auth: {
            user: GMAIL,
            pass: PASS
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "cerberus",
        product: {
            name: "MITS HALLS.",
            link: 'https://mailgen.js/' //link of our site
        }
    })
    let response = {
        body: {
            name: user.username,
            intro: 'Your booking has been cancelled!',
            table: {
                data: [
                    {
                        bookingId: booking._id,
                        hallname: hall?.hallname,
                        date: booking.date,
                    }
                ],
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        bookingId: '40%',
                        hallname: '30%'
                    }
                },
            },
            outro: "Use MITS HALLS for another booking",//link of the site
            signature: 'Thank you for choosing us:)'
        }
    }
    let mail = MailGenerator.generate(response)

    let message = {
        from: GMAIL,
        to: booking.email,
        subject: "Cancellation confirmation",
        html: mail
    }

    const result = await booking.deleteOne();  //{ _id: req.body.id }
    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email", result
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
}


const getBooking = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Booking ID required.' });

    const booking = await Booking.findOne({ _id: req.params.id }).exec();
    if (!booking) {
        return res.status(401).json({ "message": `No booking matches ID ${req.params.id}.` });
    }
    res.json(booking);
}

module.exports = {
    getAllBookings,
    NewBooking,
    cancelBooking,
    getBooking
}