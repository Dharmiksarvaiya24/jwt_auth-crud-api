const express = require('express');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();

// MongoDB schema , model and connection

const flightdetails = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  departure: {
    type: String,
    required: true
  },
  arrival: {
    type: String,
    required: true
  },
},
    { timestamps : true}
);

const flightdata = mongoose.model('flightdata', flightdetails);

mongoose.connect(process.env.MongoDB_URI)
.then(() => {
    console.log("Connected to MongoDB");})
.catch((err) => {
    console.log("Error connecting to MongoDB", err);
});


//Middleware

app.use(express.urlencoded({extended: false}));

app.use((req,res,next) => {
   
    next();
});

// routes

app.get("/api/details", async (req, res) => {
    
    const data = await flightdata.find({});
    return res.json(data);
});

app.get("/details", async (req, res) => {
    
    const data = await flightdata.find({});
    const html=
    `<ul>${data.map(item => 
    `<li>${item.id}
    ${item.name}
    ${item.time}-hrs
    ${item.arrival}-Arrival
    ${item.departure}-Departure</li>`
    ).join('')}</ul>`;
    res.send(html);
});

app.get("/api/details/:id",async(req,res) => {
    const id = req.params.id;
    const item = await flightdata.findOne({ id: id });
    return res.json(item);
});

app.post("/api/details", async (req,res) => {
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
});

app.patch("/api/details/:id",(req,res) => {
    return res.json({message: "End Point for Patch request"});
});

app.delete("/api/details/:id",(req,res) => {
    return res.json({message: "End Point for Delete request"});
});


app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});