// Controller for fetching flight data from AviationStack API
// Direct integration with AviationStack for real-time flight information

function normalizeFlightNumber(value) {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

const { FlightRadar24API } = require('flightradarapi');
const frapi = new FlightRadar24API();

async function fetchExternalFlightData(req, res) {
  try {
    const flightNumber = req.query.flightNumber;
    if (!flightNumber || typeof flightNumber !== 'string') {
      return res.status(400).json({ message: 'Flight number is required.' });
    }

    const trimmedFlightNumber = normalizeFlightNumber(flightNumber);
    console.log(`[Flight Fetch] Searching for flight: ${trimmedFlightNumber} using FlightRadar24`);

    // Extract airline code (e.g. "AI" from "AI101")
    const airlineMatches = trimmedFlightNumber.match(/^[A-Z]+/);
    const airlineCode = airlineMatches ? airlineMatches[0] : null;

    let flights = [];
    if (airlineCode) {
        flights = await frapi.getFlights(airlineCode);
    } else {
        flights = await frapi.getFlights();
    }

    // Find the specific flight number
    const flight = flights.find(f => 
      f.number === trimmedFlightNumber || 
      f.callsign === trimmedFlightNumber || 
      (f.callsign && f.callsign.includes(trimmedFlightNumber.replace(/^[A-Z]+/, '')))
    );

    if (!flight) {
      console.log(`[Flight Fetch] No active flights found for ${trimmedFlightNumber}`);
      return res.status(404).json({
        message: `Flight ${trimmedFlightNumber} not found on FlightRadar24.`
      });
    }

    console.log(`[Flight Fetch] Found flight: ${flight.number || flight.callsign}`);

    const departureAirport = flight.originAirportIata || 'N/A';
    const arrivalAirport = flight.destinationAirportIata || 'N/A';
    
    // time is in unix seconds
    let flightTime = 'N/A';
    if (flight.time) {
      flightTime = new Date(flight.time * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    const responseData = {
      id: flight.number || flight.callsign || trimmedFlightNumber,
      departure: departureAirport,
      arrival: arrivalAirport,
      time: flightTime
    };

    console.log(`[Flight Fetch] Returning data:`, responseData);
    res.json(responseData);

  } catch (err) {
    console.error('[Flight Fetch] Error:', err.message);
    res.status(500).json({
      message: `Server error: ${err.message}`
    });
  }
}

module.exports = {
  fetchExternalFlightData
};
