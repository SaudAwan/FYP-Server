const getDb = require('../../utils/db');
var joi = require('joi');
import {venuesList, venuesCount} from './query';

module.exports.addVenue = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {body} = req;
  const {error, value} = joi.validate({
    name: body.name,
    email: body.email,
    contact_number: body.contact_number,
    status: body.status
  }, {
    name: joi.string().required(),
    email: joi.string().required(),
    contact_number: joi.string().required(),
    status: joi.string().required()
  });
  if (error !== null) {
    throw error.details;
  }
  body.company_id = company_id;

  const data = await db.venues.insert(body);
  res.send(data);
}
  
module.exports.getVenues = async function (req, res, next) {
  let db = await getDb();
  var field = ["name"];
  const {company_id} = req.user;
  const queryParams = req.query;
  var {sortBy, asc, limit, offset, searchText} = queryParams;
  var params = {'deleted_at': null, company_id: company_id};
  if (searchText) {
    params.or =  [{
      "name ILIKE": "%" + searchText + "%",
    }, {
      "status ILIKE": "%" + searchText + "%",
    }];
  } else {
    field.forEach(col => {
      var likeColumn = col + " ILIKE";
      if (queryParams && queryParams[col]) params[likeColumn] =  "%" + queryParams[col] + "%";
    })
  }
  var resp = await db.venues.find(params, {
    // fields: ['id', 'email', 'updated_at', 'is_admin', 'enabled', 'account_verified'],
    // order: [{
    //   field: sortBy || 'id',
    //   direction: asc ? 'asc' : 'desc',
    //   nulls: 'first'
    // }],
    // limit: limit || 10,
    // offset: offset || 0
  });
  console.log(resp)
  res.send(resp);
}

module.exports.addEventVenue = async function ({body}, res, next) {
  let db = await getDb();
  console.log(body);

  let rows = [];
  body.venues.forEach(element => {
      rows.push({event_id: body.event_id, status: element.status || "Negotiation", venue_id: element.id});
  });
  console.log(rows);

  await db.event_venues.insert(rows);
  res.send({status: "SUCCESS"})
}
  
module.exports.getEventVenuesCount = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {event_id, searchText} = req.query;
  const countQuery = venuesCount([company_id, event_id], searchText)
  var [{count}] = await db.query(countQuery)
  res.send({count});
}
  
module.exports.getEventVenues = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  let {searchText, field, order, limit, page, event_id} = req.query;
  limit = limit || 10;
  const offset = page ? (page - 1) * limit : 0
  const params = [company_id, event_id, limit, offset];
  if (field) {
    params.push(field);
  } else {
    params.push('name');
  }
  if (order) {
    params.push(order === "asc" ? 'ASC' : 'DESC');
  } else {
    params.push('ASC');
  }
  const venuesquery = venuesList(params, searchText);
  let data = await db.query(venuesquery)
  res.send(data);
}
  
module.exports.updateEventVenue = async function (req, res, next) {
  let db = await getDb();
  const {id} = req.params;
  var {error, value} = joi.validate({id: id}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }
  let eventVenue = await db.venues.update({id: id}, req.body);
  if (eventVenue.length > 0) {
    res.send({status: 'SUCCESS', 'id': eventVenue[0].id});
  }
  else {
    throw "Event Venue doesn't exist";
  }
}