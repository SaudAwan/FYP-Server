const router = require('express').Router();
import { 
    addEventSpeaker,
    getEventSpeakers,
    updateEventSpeaker,
    addSpeaker,
    getSpeakers,
    getEventSpeakersCount,
    fetchEventSpeakers
} from "./service";

// ### EVENT SpeakerS
router.post('/', addSpeaker);
router.get('/', getSpeakers);
router.post('/ev', addEventSpeaker);
router.get('/ev', getEventSpeakers);
router.get('/fetch', fetchEventSpeakers);
router.get('/ev/count', getEventSpeakersCount);
// router.delete('/:eventSpeakerId', deleteEventSpeaker);
router.patch('/ev/:id', updateEventSpeaker);

module.exports = router;