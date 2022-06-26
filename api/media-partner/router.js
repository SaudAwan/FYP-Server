const router = require('express').Router();
import { 
    addEventMediaPartner,
    getEventMediaPartners,
    getMediaPartnerTypes,
    updateMediaPartner,
    addMediaPartner,
    getMediaPartners,
    getEventMediaPartnersCount
} from "./service";

// ### EVENT SPONSORS
router.post('/', addMediaPartner);
router.get('/', getMediaPartners);
router.post('/ev', addEventMediaPartner);
router.get('/ev', getEventMediaPartners);
router.get('/ev/count', getEventMediaPartnersCount);
router.get('/types', getMediaPartnerTypes);
// router.delete('/:eventMediaPartnerId', deleteEventMediaPartner);
router.patch('/ev/:id', updateMediaPartner);

module.exports = router;