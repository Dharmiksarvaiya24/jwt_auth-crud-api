const flightdata = require("../models/data"); 


async function getDetails(req, res) {
    const data = await flightdata.find({});
    return res.json(data);
}

async function getDetailsById(req, res) {
    const id = req.params.id;
    const item = await flightdata.findOne({ id: id });
    return res.json(item);
}

async function updatedetails(req, res) {
    const { ObjectId } = require("mongoose").Types;
    try {
        const result = await flightdata.findByIdAndUpdate(new ObjectId(req.params.id), req.body, { new: true });
        if (!result) {
            return res.status(404).json({message: "Flight not found"});
        }
        return res.json({message: "Success", result});
    } catch (err) {
        return res.status(400).json({message: "Invalid ID format"});
    }
}

async function deletedetails(req, res) {
    const { ObjectId } = require("mongoose").Types;
    try {
        const result = await flightdata.findByIdAndDelete(new ObjectId(req.params.id));
        if (!result) {
            return res.status(404).json({message: "Flight not found"});
        }
        return res.json({message: "Flight deleted successfully"});
    } catch (err) {
        return res.status(400).json({message: "Invalid ID format"});
    }
}

async function createdetails(req, res) {
    const body = req.body;
        if(
            !body ||
            !body.id ||
            !body.time ||
            !body.departure ||
            !body.arrival
        )
        {
                return res.status(400).json({message: "All fields are required"});
        }
  const result = await flightdata.create({
    id: body.id,
    time: body.time,
    departure: body.departure,
    arrival: body.arrival
   });
   console.log(result);
   return res.status(201).json({message: "Success", result});
}

module.exports = {
    getDetails,
    getDetailsById,
    updatedetails,
    deletedetails,
    createdetails,
};