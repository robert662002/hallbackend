const Hall = require('../model/Hall')// Assuming the hall model is in a separate file
const Booking = require('../model/Booking');

async function getAvailableHalls(req, res) {
  console.log(req.body)
  const startTimeParts = req.body.startTime.split(':');
  const startHour = parseInt(startTimeParts[0]);
  const startMinute = parseInt(startTimeParts[1]);

  const endTimeParts = req.body.endTime.split(':');
  const endHour = parseInt(endTimeParts[0]);
  const endMinute = parseInt(endTimeParts[1]);

  const startDate = new Date(req.body.date);
  startDate.setHours(startHour);
  startDate.setMinutes(startMinute);

  const endDate = new Date(req.body.date);
  endDate.setHours(endHour);
  endDate.setMinutes(endMinute);


  const overlappingBookings = await Booking.find({
    date: req.body.date,
    $or: [
      {
        starttime: { $lt: endDate },
        endtime: { $gt: startDate }
      },
      {
        starttime: { $lte: startDate },
        endtime: { $gte: endDate }
      }
    ]
  });


  const bookedHallIds = overlappingBookings.map((booking) => booking.hallid);

  const acValue = req.body.ac === 'true'; // Convert string to boolean
  const projectorValue = req.body.projector === 'true'; // Convert string to boolean

  const hallQuery = {
    _id: { $nin: bookedHallIds },
    capacity: { $gte: req.body.minCapacity },
  };

  if (acValue) {
    hallQuery.ac = true;
  }

  if (projectorValue) {
    hallQuery.projector = true;
  }

  const availableHalls = await Hall.find(hallQuery);

  if (availableHalls.length === 0) {
    return res.json({ message: 'No available halls found.' });
  }

  res.json(availableHalls);
}

module.exports = { getAvailableHalls };

/* The code begins by importing the necessary models for Hall and Booking using the appropriate paths. These models represent the Mongoose schemas for the halls and bookings.

The getAvailableHalls function is defined, which takes two parameters: req and res. These parameters represent the request and response objects from the framework you are using (e.g., Express.js).

The function extracts the required information from the req.body object. Assuming the request contains the necessary data in the request body, the date, startTime, endTime, and minCapacity values are destructured from req.body.

The startDate and endDate variables are created as Date objects using the provided date. These variables will be used to define the time range.

The setHours() method is used to set the hours and minutes of the startDate and endDate objects based on the startTime and endTime parameters. This step ensures that the time range is taken into account when searching for overlapping bookings.

The Booking model's find method is used to query the database and retrieve any bookings that overlap with the provided time range. The query is constructed using the following conditions:

The date field of the booking should match the startDate.
The $or operator is used to combine three conditions using the $and operator:
Condition 1: Checks if the booking's start time (starttime) is before startDate and the end time (endtime) is after startDate. This condition detects overlapping bookings at the beginning of the provided time range.
Condition 2: Checks if the booking's start time is before endDate and the end time is after endDate. This condition detects overlapping bookings at the end of the provided time range.
Condition 3: Checks if the booking's start time is greater than or equal to startDate and the end time is less than or equal to endDate. This condition detects bookings that are completely within the provided time range.
The resulting overlapping bookings are stored in the overlappingBookings variable.

The bookedHallIds array is created by extracting the hallid values from the overlappingBookings array using the map method. This array contains the IDs of the halls that have bookings during the specified time range.

The Hall model's find method is used to query the database and retrieve the available halls. The query is constructed using the following conditions:

The _id field should not be in the bookedHallIds array, ensuring that only halls without overlapping bookings are selected.
The capacity field should be greater than or equal to the specified minCapacity.
The resulting available halls are stored in the availableHalls variable.


An if statement is used to check if there are any available halls. If the availableHalls array is empty (length is 0), it means no halls meet the specified criteria.

If no available halls are found, a JSON response is sent back using res.json(), containing a message indicating that no available halls were found.

If there are available halls, a JSON response is sent back with the availableHalls array, which contains the details of the available halls that meet the criteria. */