const express = require('express');
const router = express.Router();

const {
  createuser,
  deleteuser,
  getuser,
  refreshToken,
} = require("../controller/user");

router.post("/signup", createuser);
router.delete("/:id", deleteuser);
router.post("/login", getuser);
router.post("/refresh-token", refreshToken);

module.exports = router;
