const express = require('express');
const router = express.Router();

const {
  createuser,
  deleteuser,
  getuser,
} = require("../controller/user");

router.post("/signup", createuser);
router.delete("/:id", deleteuser);
router.post("/login", getuser);

module.exports = router;
