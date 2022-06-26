const router = require('express').Router();
import { 
    addEventVendor,
    getEventVendors,
    updateEventVendor,
    addVendor,
    getVendors,
    getEventVendorsCount
} from "./service";

// ### EVENT SPONSORS
router.post('/', addVendor);
router.get('/', getVendors);
router.post('/ev', addEventVendor);
router.get('/ev', getEventVendors);
router.get('/ev/count', getEventVendorsCount);
// router.delete('/:eventVendorId', deleteEventVendor);
router.patch('/ev/:id', updateEventVendor);

module.exports = router;