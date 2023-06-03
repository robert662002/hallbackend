const Hall = require('../model/Hall');

const getAllHalls = async (req, res) => {
    const halls = await Hall.find();
    if (!halls) return res.status(204).json({ 'message': 'No halls found.' });
    res.json(halls);
}

const createNewHall = async (req, res) => {
    if (!req?.body?.hallname || !req?.body?.capacity || !req?.body?.ac || !req?.body?.projector) {
        return res.status(400).json({ 'message': 'All fields are required' });
    }

    try {
        const result = await Hall.create({
            hallname: req.body.hallname,
            capacity: req.body.capacity,
            ac: req.body.ac === "true",
            projector: req.body.projector === "true"
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}


const updateHall = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const hall = await Hall.findOne({ _id: req.body.id }).exec();
    if (!hall) {
        return res.status(204).json({ "message": `No hall matches ID ${req.body.id}.` });
    }

    if (req.body?.hallname) hall.hallname = req.body.hallname;
    if (req.body?.capacity) hall.capacity = req.body.capacity;
    if (req.body?.ac) hall.ac = req.body.ac === "true";
    if (req.body?.projector) hall.projector = req.body.projector === "true";

    const result = await hall.save();
    res.json(result);
}


const deleteHall = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Hall ID required.' });
    console.log(req.body)

    const hall = await Hall.findOne({ _id: req.body.id }).exec();
    if (!hall) {
        return res.status(204).json({ "message": `No hall matches ID ${req.body.id}.` });
    }
    const result = await hall.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getHall = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Hall ID required.' });

    const hall = await Hall.findOne({ _id: req.params.id }).exec();
    if (!hall) {
        return res.status(204).json({ "message": `No hall matches ID ${req.params.id}.` });
    }
    res.json(hall);
    console.log(hall)
}

module.exports = {
    getAllHalls,
    createNewHall,
    updateHall,
    deleteHall,
    getHall
}