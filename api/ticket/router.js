const router = require('express').Router();
import { 
    addEventTicket,
    getEventTickets,
    updateEventTicket,
    getEventTicketsCount
} from "./service";

// ### EVENT SPONSORS
router.post('/ev', addEventTicket);
router.get('/ev', getEventTickets);
router.get('/ev/count', getEventTicketsCount);
// router.delete('/:eventTicketId', deleteEventTicket);
router.patch('/ev/:id', updateEventTicket);

module.exports = router;