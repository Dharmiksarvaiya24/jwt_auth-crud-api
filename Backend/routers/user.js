const express = require('express');
const router = express.Router();

const {
  createuser,
  deleteuser,
  getuser,
  refreshToken,
  verifyOtp,
} = require("../controller/user");
const { verify } = require('jsonwebtoken');

router.post("/signup", createuser);
router.delete("/:id", deleteuser);
router.post("/login", getuser);
router.post("/refresh-token", refreshToken);
router.post("/verify-otp", verifyOtp);

module.exports = router;
