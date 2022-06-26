module.exports = (socket) => {
    var router = require('express').Router();

    const user = require('./user/router');
    const event = require('./event/router');
    const team = require('./team/router');
    const sponsor = require('./sponsor/router');
    const speaker = require('./speaker/router');
    const assosciation = require('./assosciation/router');
    const mediaPartner = require('./media-partner/router');
    const venue = require('./venue/router');
    const ticket = require('./ticket/router');
    const inventory = require('./inventory/router');
    const vendor = require('./vendor/router');
    const delegate = require('./delegate/router');
    const agenda = require('./agenda/router')(socket)
    const task = require('./task/router')(socket)

    router.use('/user', user);

    router.use('/agenda', agenda)

    router.use('/event', event);

    router.use('/sponsor', sponsor);

    router.use('/speaker', speaker);

    router.use('/assosciation', assosciation);

    router.use('/media-partner', mediaPartner);

    router.use('/venue', venue);

    router.use('/ticket', ticket);

    router.use('/inventory', inventory);

    router.use('/vendor', vendor);

    router.use('/team', team);

    router.use('/delegate', delegate);

    router.use('/task', task);

    return router
};
