const router = require('express').Router();
import { 
    addEventAssosciation,
    getEventAssosciations,
    updateEventAssosciation,
    addAssosciation,
    getAssosciations,
    getEventAssosciationsCount
} from "./service";

// ### EVENT AssosciationS
router.post('/', addAssosciation);
router.get('/', getAssosciations);
router.post('/ev', addEventAssosciation);
router.get('/ev', getEventAssosciations);
router.get('/ev/count', getEventAssosciationsCount);
// router.delete('/:eventAssosciationId', deleteEventAssosciation);
router.patch('/ev/:id', updateEventAssosciation);

module.exports = router;