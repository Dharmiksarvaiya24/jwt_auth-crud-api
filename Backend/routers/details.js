const express = require('express');
const router = express.Router();

const{
        getDetails,
        getDetailsById,
        updatedetails,
        deletedetails,
        createdetails,
    } = require("../controller/details");

router.get("/", getDetails);
router.get("/:id", getDetailsById);
router.post("/", createdetails);
router.patch("/:id", updatedetails);
router.delete("/:id", deletedetails);

module.exports = router;
