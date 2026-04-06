const userdata = require("../models/user");
const jwt =require('jsonwebtoken');

async function createuser(req, res) {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser = await userdata.findOne({email});
        if (existingUser) {
            return res.status(409).json({message: "User already exists"});
        }

        const user = new userdata({ name, email, password });

        // Bug Fix #2: Save user to the database
        await user.save();

        // Bug Fix #1: Generate a real refreshToken JWT (removed nested function)
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "User created successfully",
            accessToken,
            refreshToken,
        });
    } catch (error) {
        return res.status(500).json({message: "Failed to create user"});
    }
}



async function deleteuser(req, res) {
    try {
        const deletedUser = await userdata.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({message: "User not found"});
        }

        return res.json({message: "Success"});
    } catch (error) {
        return res.status(500).json({message: "Failed to delete user"});
    }
}

async function getuser(req, res) {
    try {
        const {email, password} = req.body;

        const user = await userdata.findOne({email});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const isStoredPasswordHashed = typeof user.password === "string" && user.password.startsWith("$2");
        let isPasswordValid = false;

        if (isStoredPasswordHashed) {
            isPasswordValid = await user.comparePassword(password);
        } else if (user.password === password) {
            user.password = password;
            await user.save();
            isPasswordValid = true;
        }

        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials"});
        }

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );
    return res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
    });

    } catch (error) {
        return res.status(500).json({message: "Login failed"});
    }
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }
    try {
       
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        return res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
}

module.exports = {
    createuser,
    getuser,
    deleteuser,
    refreshToken,
};