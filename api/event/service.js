
const getDb = require('../../utils/db');
var moment = require('moment');
var joi = require('joi');

module.exports.addEvent = async function (team, body) {
  let db = await getDb();
  const parsedTeamObject= await JSON.parse(team)
  const {company_id,id}=parsedTeamObject
  joi.validate({
    name: body.name,
    company_id,
    category_id: body.category_id,
    start_date: body.start_date,
    end_date: body.end_date,
    location: body.location,
    target_revenue: body.target_revenue,
    sponsorship: body.sponsorship,
    delegates_sales: body.delegates_sales,
    marketing: body.marketing
  }, {
    name: joi.string().required(),
    company_id: joi.number().integer().required(),
    category_id: joi.number().integer().required(),
    start_date: joi.date(),
    end_date: joi.date(),
    location: joi.string(),
    target_revenue: joi.number().integer(),
    sponsorship: joi.number().integer(),
    delegates_sales: joi.number().integer(),
    marketing: joi.number().integer()
  })
  .then(async(value)=>{
    value.team_id=id
    return await db.events.insert(value);
  })
  .catch((err)=>{
    throw err
  })
}

module.exports.getEvents = async function (queryParams) {
  let db = await getDb();
  var field = ['name', 'category', 'start_date', 'end_date', 'location'];
  var {sortBy, asc, limit, offset} = queryParams;
  var params = {'deleted_at': null};
  field.forEach(col => {
    var likeColumn = col + ' like';
    if (queryParams && queryParams[col]) {
      params[likeColumn] =  '%' + queryParams[col] + '%';
    }
  })

  var events = await db.events.find(params,{
    // fields: ['id', 'email', 'updated_at', 'is_admin', 'enabled', 'account_verified'],
    order: [{
      field: sortBy || 'id',
      direction: asc ? 'asc' : 'desc',
      nulls: 'first'
    }],
    limit: limit || 10,
    offset: offset || 0
  })
  // events = events.map(el => {
  //   el.start_date = moment(el.start_date).format('DD-MM-YYYY HH:mm:ss');
  //   el.end_date = moment(el.end_date).format('DD-MM-YYYY HH:mm:ss');
  //   return el;
  // });
  return events;
}

module.exports.getEmployeeEvents=async function(employeeId,params){
  try{
    let db = await getDb();
    const data=await db.team_users.join({
      events:{
        type:'INNER',
        on: {team_id:'team_id' }
      }
    })
    .find({
      user_id:employeeId
    })
    return data
  } catch(err){
    console.log(err)
  }
  
}

module.exports.getEvent = async function (companyId, eventId) {
  let db = await getDb();

  const {error, value} = joi.validate({id: eventId}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  let event = await db.events.findOne({
    id: eventId, 
    company_id: companyId
  }, {
    fields: ['id', 'email', 'name', 'role', 'profile_pic',
    'updated_at', 'is_admin', 'enabled', 'account_verified']
  });
  if (event) {
    return event;
  }
  else {
    throw "Event doesn't exist";
  }
}

module.exports.updateEvent = async function (eventId, values) {
  let db = await getDb();

  var {error, value} = joi.validate({id: eventId}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  // var {error, value} = joi.validate(values, {
  //   is_admin: joi.boolean(),
  //   enabled: joi.boolean(),
  //   account_verified: joi.boolean()
  // });
  // if (error !== null) {
  //   throw error.details;
  // }

  let event = await db.events.update({id: eventId}, values);
  console.log(event);
  if (event.length > 0) {
    return {'id': event[0].id};
  }
  else {
    throw "Event doesn't exist";
  }
}

module.exports.getEvCategories = async function () {
  let db = await getDb();

  return await db.event_categories.find({}, {
      fields: ['id', 'name'],
      order: [{
          field: 'id',
          direction: 'asc',
          nulls: 'first'
      }]
  });
}

// ### VENUE
module.exports.addEventVenue = async function (body) {
  let db = await getDb();
  console.log(body);

  let rows = [];
  body.venues.forEach(element => {
      rows.push({event_id: body.event_id, type: element.type, venue_id: element.id});
  });

  return await db.event_venues.insert(rows);
}

module.exports.getEventVenues = async function (companyId, queryParams) {
  let db = await getDb();
  var field = ["name", "company", "designation", "type"];
  var {sortBy, asc, limit, offset, event_id} = queryParams;
  return await db.venues.find({
    company_id: companyId
  });
}

module.exports.updateEventVenue = async function (eventVenueId, values) {
  let db = await getDb();

  var {error, value} = joi.validate({id: eventVenueId}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  let eventVenue = await db.event_venues.update({id: eventVenueId}, values);
  if (eventVenue.length > 0) {
    return {'id': eventVenue[0].id};
  }
  else {
    throw "Event Venue doesn't exist";
  }
}

// ### EVENT VENDOR 

module.exports.addEventVendor = async function (body) {
  let db = await getDb();
  console.log(body);

  let rows = [];
  body.vendors.forEach(element => {
      rows.push({event_id: body.event_id, type: element.type, vendor_id: element.id});
  });

  return await db.event_vendors.insert(rows);
}

module.exports.getEventVendors = async function (companyId, queryParams) {
  let db = await getDb();
  var field = ["name", "company", "designation", "type"];
  var {sortBy, asc, limit, offset, event_id} = queryParams;
  return await db.vendors.find({
    company_id: companyId
  });
}

module.exports.updateEventVendor = async function (eventVendorId, values) {
  let db = await getDb();

  var {error, value} = joi.validate({id: eventVendorId}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  let eventVendor = await db.event_vendors.update({id: eventVendorId}, values);
  if (eventVendor.length > 0) {
    return {'id': eventVendor[0].id};
  }
  else {
    throw "Event Vendor doesn't exist";
  }
}

//## EVENT TICKET
module.exports.addEventTicket = async function (companyId, body) {
  let db = await getDb();
  
  const {error, value} = joi.validate({
    name: body.name,
    contact_number: body.contact_number,
    flight_status: body.flight_status,
    accomodation: body.accomodation
  }, {
    name: joi.string().required(),
    contact_number: joi.string().required(),
    flight_status: joi.string().required(),
    accomodation: joi.string().required(),
  });
  if (error !== null) {
    throw error.details;
  }
  body.company_id = companyId;
  return await db.event_tickets.insert(body);
}

module.exports.getEventTickets = async function (companyId, queryParams) {
let db = await getDb();
var field = ["name", "company", "designation", "type"];
var {sortBy, asc, limit, offset, event_id} = queryParams;
return await db.event_tickets.find({
  company_id: companyId,
  deleted_at: null
});
}

module.exports.updateEventTicket = async function (eventTicketId, values) {
let db = await getDb();

var {error, value} = joi.validate({id: eventTicketId}, {
  id: joi.number().integer().required()
});
if (error !== null) {
  throw error.details;
}

let eventTicket = await db.event_tickets.update({id: eventTicketId}, values);
if (eventTicket.length > 0) {
  return {'id': eventTicket[0].id};
}
else {
  throw "Event Ticket doesn't exist";
}
}