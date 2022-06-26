var teamServices = require('./service.js');
var moment = require('moment');

module.exports.addTeam = async function(user, body) {
  let team = await teamServices.addTeam(user, body);
  return team;
}

module.exports.getTeams = async function(userId, params) {
  return await teamServices.getTeams(userId, params);
}

module.exports.getTeam = async function(companyId, teamId) {
  return await teamServices.getTeam(companyId, teamId);
}

module.exports.getEmployeeTeams=async function(employeeId,params){
  return await teamServices.getEmployeeTeams(employeeId,params)
}

module.exports.getTeamUsers = async function(teamId, params) {
  return await teamServices.getTeamUsers(teamId, params);
}

module.exports.deleteTeam = async function(teamId) {
  return await teamServices.updateTeam(teamId, {'deleted_at': moment().format('DD-MM-YYYY HH:mm:ss')});
}

module.exports.updateTeam = async function(teamId, values) {
  return await teamServices.updateTeam(teamId, values);
}