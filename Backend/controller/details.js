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
    await flightdata.findOneAndUpdate({id: req.params.id}, { name : "6E2799" });
    return res.json({message: "Success"});
}

async function deletedetails(req, res) {
    await flightdata.findOneAndDelete({id: req.params.id});
    return res.json({message: "Success"});
}

async function createdetails(req, res) {
    const body = req.body;
        if(
            !body ||
            !body.id ||
            !body.name ||
            !body.time ||
            !body.departure ||
            !body.arrival
        )
        {
                return res.status(400).json({message: "All fields are req..."});
        }
  const result = await flightdata.create({
    id: body.id,
    name: body.name,
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