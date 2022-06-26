var handler = require("../../utils/controllerHandler.js");
var controller = require('./controller.js');
var router = require('express').Router();
var middleware=(req,res,next)=>{
    console.log(req.body)
}
// ### EVENT CATEGORIES
router.get('/category', handler(controller.getEvCategories, (req, res, next) => []));
router.get('/employeeevents',handler(controller.getEmployeeEvents, (req,res,next)=>[req.query.employeeId,req.query]))
router.post('/', handler(controller.addEvent, (req, res, next) => [req.body.team, req.body]));
router.get('/', handler(controller.getEvents, (req, res, next) => [req.query]));
router.delete('/:eventId', handler(controller.deleteEvent, (req, res, next) => [req.params.eventId]));
router.patch('/:eventId', handler(controller.updateEvent, (req, res, next) => [req.params.eventId, req.body]));
router.get('/:eventId', handler(controller.getEvent, (req, res, next) => [req.user.company_id, req.params.eventId]));

module.exports = router;