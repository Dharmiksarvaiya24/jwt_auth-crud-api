const userdata = require("../models/user");
const jwt =require('jsonwebtoken');
const crypto = require("crypto");
const { sendOTP } = require("./otp");



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

        const otp = String(Math.floor(1000 + Math.random() * 9000));
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        user.otpHash = otpHash;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; 
        user.otppurpose = "signup";
        user.otpattempts = 0;
        await user.save();

       try{
        await sendOTP(user.email, otp);
         } catch (error) {
            console.error("Error sending OTP:", error);
            return res.status(500).json({message: "Failed to send OTP"});
        }

       return res.status(201).json({
        message: "OTP sent to email",
        needsOtp: true,
        email: user.email,
        purpose: "signup",
       
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

         const otp = String(Math.floor(1000 + Math.random() * 9000));
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        user.otpHash = otpHash;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; 
        user.otppurpose = "login";
        user.otpattempts = 0;
        await user.save();

       try{
        await sendOTP(user.email, otp);
         } catch (error) {
            console.error("Error sending OTP:", error);
            return res.status(500).json({message: "Failed to send OTP"});
        }

     return res.status(201).json({
        message: "OTP sent to email",
        needsOtp: true,
        email: user.email,
        purpose: "login",
       
    });

    } catch (error) {
        return res.status(500).json({message: "Login failed"});
    }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp || !purpose) {
      return res.status(400).json({ message: "email, otp, purpose are required" });
    }

    const user = await userdata.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpHash || !user.otpExpiry || !user.otppurpose) {
      return res.status(400).json({ message: "No OTP found. Please login/signup again." });
    }

    if (user.otppurpose !== purpose) {
      return res.status(400).json({ message: "OTP purpose mismatch" });
    }

    const expiryMs = new Date(user.otpExpiry).getTime();
    if (!expiryMs || Date.now() > expiryMs) {
      user.otpHash = undefined;
      user.otpExpiry = undefined;
      user.otppurpose = undefined;
      user.otpattempts = 0;
      await user.save();
      return res.status(400).json({ message: "OTP expired. Please resend OTP." });
    }

    const attempts = Number(user.otpattempts || 0);
    if (attempts >= 3) {
      return res.status(429).json({ message: "Too many attempts. Please resend OTP." });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    if (otpHash !== user.otpHash) {
      user.otpattempts = attempts + 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otpHash = undefined;
    user.otpExpiry = undefined;
    user.otppurpose = undefined;
    user.otpattempts = 0;
    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "OTP verified",
      accessToken,
      refreshToken,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "OTP verification failed" });
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
    verifyOtp,
};
