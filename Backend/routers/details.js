const express = require('express');
const router = express.Router();

const{
        getDetails,
        getDetailsById,
        updatedetails,
        deletedetails,
        createdetails,
    } = require("../controller/details");
const { auth } = require("../middelwares");


router.get("/", auth, getDetails);
router.get("/:id", auth, getDetailsById);
router.post("/", auth, createdetails);
router.patch("/:id", auth, updatedetails);
router.delete("/:id", auth, deletedetails);

module.exports = router;
