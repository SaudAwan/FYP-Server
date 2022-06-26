var service = require('./service.js');

module.exports.addEvent = async function(companyId, body) {
  let event = await service.addEvent(companyId, body);
  return event;
}

module.exports.getEvents = async function(params) {
  return await service.getEvents(params);
}

module.exports.getEvent = async function(companyId, eventId) {
  return await service.getEvent(companyId, eventId);
}

module.exports.getEmployeeEvents= async function(employee_id,params){
  return await service.getEmployeeEvents(employee_id,params)
}

module.exports.deleteEvent = async function(eventId) {
  return await service.updateEvent(eventId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEvent = async function(eventId, values) {
  return await service.updateEvent(eventId, values);
}

module.exports.getEvCategories = async function() {
  return await service.getEvCategories();
}

module.exports.addEventSponsor = async function(body) {
  let event = await service.addEventSponsor(body);
  return event;
}

module.exports.getEventSponsor = async function(companyId, params) {
  return await service.getEventSponsor(companyId, params);
}

module.exports.deleteEventSponsor = async function(eventSponsorId) {
  return await service.updateEventSponsor(eventSponsorId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEventSponsor = async function(eventSponsorId, values) {
  return await service.updateEventSponsor(eventSponsorId, values);
}

module.exports.addEventDelegate = async function(body) {
  let event = await service.addEventDelegate(body);
  return event;
}

module.exports.getEventDelegate = async function(companyId, params) {
  return await service.getEventDelegate(companyId, params);
}

module.exports.deleteEventDelegate = async function(eventDelegateId) {
  return await service.updateEventDelegate(eventDelegateId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEventDelegate = async function(eventDelegateId, values) {
  return await service.updateEventDelegate(eventDelegateId, values);
}


module.exports.addEventSpeaker = async function(body) {
  let event = await service.addEventSpeaker(body);
  return event;
}

module.exports.getEventSpeakers = async function(companyId, params) {
  return await service.getEventSpeakers(companyId, params);
}

module.exports.deleteEventSpeaker = async function(eventSponsorId) {
  return await service.updateEventSpeaker(eventSponsorId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEventSpeaker = async function(eventSponsorId, values) {
  return await service.updateEventSpeaker(eventSponsorId, values);
}

module.exports.addEventAssosciations = async function(body) {
  let event = await service.addEventAssosciations(body);
  return event;
}

module.exports.getEventAssosciations = async function(companyId, params) {
  return await service.getEventAssosciations(companyId, params);
}

module.exports.deleteEventAssosciation = async function(eventAssosciationId) {
  return await service.updateEventAssosciation(eventAssosciationId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEventAssosciation = async function(eventAssosciationId, values) {
  return await service.updateEventAssosciation(eventAssosciationId, values);
}

// ### VENUE
module.exports.addEventVenue = async function(body) {
  let event = await service.addEventVenue(body);
  return event;
}

module.exports.getEventVenues = async function(companyId, params) {
  return await service.getEventVenues(companyId, params);
}

module.exports.deleteEventVenue = async function(eventVenueId) {
  return await service.updateEventVenue(eventVenueId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEventVenue = async function(eventVenueId, values) {
  return await service.updateEventVenue(eventVenueId, values);
}

// ### VENDOR
module.exports.addEventVendor = async function(body) {
  let event = await service.addEventVendor(body);
  return event;
}

module.exports.getEventVendors = async function(companyId, params) {
  return await service.getEventVendors(companyId, params);
}

module.exports.deleteEventVendor = async function(eventVendorId) {
  return await service.updateEventVendor(eventVendorId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEventVendor = async function(eventVendorId, values) {
  return await service.updateEventVendor(eventVendorId, values);
}

// ### TICKET
module.exports.addEventTicket = async function(companyId, body) {
  let event = await service.addEventTicket(companyId, body);
  return event;
}

module.exports.getEventTickets = async function(companyId, params) {
  return await service.getEventTickets(companyId, params);
}

module.exports.deleteEventTicket = async function(eventTicketId) {
  return await service.updateEventTicket(eventTicketId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEventTicket = async function(eventTicketId, values) {
  return await service.updateEventTicket(eventTicketId, values);
}

// ### INVENTORY
module.exports.addEventInventory = async function(companyId, body) {
  let event = await service.addEventInventory(companyId, body);
  return event;
}

module.exports.getEventInventory = async function(companyId, params) {
  return await service.getEventInventory(companyId, params);
}

module.exports.deleteEventInventory = async function(eventInventoryId) {
  return await service.updateEventInventory(eventInventoryId, {'deleted_at': new Date().toISOString()});
}

module.exports.updateEventInventory = async function(eventInventoryId, values) {
  return await service.updateEventInventory(eventInventoryId, values);
}

module.exports.getSponsorTypes = async function(companyId) {
  return await service.getSponsorTypes(companyId);
}