var router = require('express').Router();
import {
    addDelegate,
    getDelegates,
    getDelegateCategories,
    addEventDelegate,
    getEventDelegate,
    updateEventDelegate,
    getEventDelegatesCount
} from './service';

router.post('/', addDelegate);

router.get('/', getDelegates);

router.get('/category', getDelegateCategories);

router.post('/ev', addEventDelegate);

router.get('/ev', getEventDelegate);

router.get('/ev/count', getEventDelegatesCount);

// router.delete('/ev/:eventDelegateId', handler(controller.deleteEventDelegate, (req, res, next) => [req.params.eventDelegateId]));

router.patch('/ev/:id', updateEventDelegate);

module.exports = router;