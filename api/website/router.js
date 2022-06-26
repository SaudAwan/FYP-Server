const router = require('express').Router();
import { 
    addEventSponsor,
    getEventSponsor,
    getSponsorTypes,
    updateEventSponsor,
    addSponsor,
    getSponsors
} from "./service";

// ### EVENT SPONSORS
router.post('/', addSponsor);
router.get('/', getSponsors);
router.post('/ev', addEventSponsor);
router.get('/ev', getEventSponsor);
router.get('/types', getSponsorTypes);
// router.delete('/:eventSponsorId', deleteEventSponsor);
router.patch('/ev/:id', updateEventSponsor);

module.exports = router;