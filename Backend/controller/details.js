const flightdata = require("../models/data");

// helper to get user id from req.user (JWT payload uses userId)
function getUserIdFromReq(req) {
    return req.user && (req.user.userId || req.user.userId === 0) ? req.user.userId : (req.user && (req.user._id || req.user.id));
}


async function getDetails(req, res) {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const data = await flightdata.find({ owner: userId });
    return res.json(data);
}

async function getDetailsById(req, res) {
    const id = req.params.id;
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
   
    const item = await flightdata.findOne({ _id: id, owner: userId });
    if (!item) return res.status(404).json({ message: "Flight not found" });
    return res.json(item);
}

async function updatedetails(req, res) {
    const { ObjectId } = require("mongoose").Types;
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    try {
      
        const result = await flightdata.findOneAndUpdate(
            { _id: new ObjectId(req.params.id), owner: userId },
            req.body,
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ message: "Flight not found or not owned by user" });
        }
        return res.json({ message: "Success", result });
    } catch (err) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
}

async function deletedetails(req, res) {
    const { ObjectId } = require("mongoose").Types;
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    try {
        const result = await flightdata.findOneAndDelete({ _id: new ObjectId(req.params.id), owner: userId });
        if (!result) {
            return res.status(404).json({ message: "Flight not found or not owned by user" });
        }
        return res.json({ message: "Flight deleted successfully" });
    } catch (err) {
        return res.status(400).json({ message: "Invalid ID format" });
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
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await flightdata.create({
        id: body.id,
        time: body.time,
        departure: body.departure,
        arrival: body.arrival,
        owner: userId
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