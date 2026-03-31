const express = require('express');
const data = require('./MOCK_DATA.json');

const app = express();
const port = 8080;

app.get("/api/details", (req, res) => {
    res.json(data);
});

app.get("/details", (req, res) => {
    const html=
    `<ul>${data.map(item => 
    `<li>${item.id}</li>
    <li>${item.name}</li>
    <li>${item.Time}hrs</li>`
    ).join('')}</ul>`;
    res.send(html);
});

app.get("/api/details/:id",(req,res) => {
    const id = req.params.id;
    const item = data.find((data) => data.id === id);
    return res.json(item);
});

app.post("/api/details",(req,res) => {
    return res.json({message: "End Point for POST request"});
});

app.patch("/api/details/:id",(req,res) => {
    return res.json({message: "End Point for Patch request"});
});

app.delete("/api/details/:id",(req,res) => {
    return res.json({message: "End Point for Delete request"});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});