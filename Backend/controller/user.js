const userdata = require("../models/user");

async function createuser(req, res) {
    const {name, email, password} = req.body;
    const user = new userdata({
        name,
        email,
        password,
    });
    await user.save();
    return res.json({message: "Success"});
}

async function deleteuser(req, res) {
    await userdata.findOneAndDelete({id: req.params.id});
    return res.json({message: "Success"});
}

async function getuser(req, res) {
   const {email,password} = req.body;
   const user = await userdata.findOne({email: email});
    if(!email){
        return res.status(404).json({message: "User not found"});
    }
    if(user.password !== password){
        return res.status(401).json({message: "Invalid credentials"});
    }
    return res.json({message: "Success"});

}

module.exports = {
    createuser,
    getuser,
    deleteuser,
};