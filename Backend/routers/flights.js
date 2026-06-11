const express = require('express');
const router = express.Router();
const { fetchExternalFlightData } = require('../controller/flights');
const { auth } = require('../middelwares');

// This route is protected to ensure only logged-in users can use the feature.
router.get('/fetch-external', auth, fetchExternalFlightData);

module.exports = router;
