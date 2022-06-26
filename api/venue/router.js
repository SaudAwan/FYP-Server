const router = require('express').Router();
import { 
    addEventVenue,
    getEventVenues,
    updateEventVenue,
    addVenue,
    getVenues,
    getEventVenuesCount
} from "./service";

// ### EVENT SPONSORS
router.post('/', addVenue);
router.get('/', getVenues);
router.post('/ev', addEventVenue);
router.get('/ev', getEventVenues);
router.get('/ev/count', getEventVenuesCount);
// router.delete('/:eventVenueId', deleteEventVenue);
router.patch('/ev/:id', updateEventVenue);

module.exports = router;