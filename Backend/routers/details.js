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
router.get("/:id",getDetailsById);
router.patch("/api/:id",updatedetails);
router.delete("/api/:id",deletedetails);
router.post("/api",createdetails);

module.exports = router;
