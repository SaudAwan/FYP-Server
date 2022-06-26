var handler = require("../../utils/controllerHandler.js");
var teamControllers = require('./controller.js');

var router = require('express').Router();
router.post('/', handler(teamControllers.addTeam, (req, res, next) => [req.query, req.body]));
router.get('/', handler(teamControllers.getTeams, (req, res, next) => [req.query.company_id, req.query]));
router.get('/employeeteams',handler(teamControllers.getEmployeeTeams,(req,res,next)=>[req.query.employeeId,req.query]))
router.get('/users',handler(teamControllers.getTeamUsers,(req,res,next)=> [req.query.team_id,req.query]))
router.delete('/:teamId', handler(teamControllers.deleteTeam, (req, res, next) => [req.params.teamId]));
router.patch('/:teamId', handler(teamControllers.updateTeam, (req, res, next) => [req.params.teamId, req.body]));

router.get('/:teamId', handler(teamControllers.getTeam, (req, res, next) => [req.user.company_id, req.params.teamId]));

module.exports = router;