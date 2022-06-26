const getDb = require('../../utils/db');
var joi = require('joi');
import {ticketsList, ticketsCount} from './query';

module.exports.addTicket = async function (req, res, next) {
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

  const data = await db.event_tickets.insert(body);
  res.send(data);
}
  
module.exports.getTickets = async function (req, res, next) {
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
  var resp = await db.event_tickets.find(params, {
    // fields: ['id', 'email', 'updated_at', 'is_admin', 'enabled', 'account_verified'],
    // order: [{
    //   field: sortBy || 'id',
    //   direction: asc ? 'asc' : 'desc',
    //   nulls: 'first'
    // }],
    // limit: limit || 10,
    // offset: offset || 0
  });
  res.send(resp);
}

module.exports.addEventTicket = async function ({body}, res, next) {
  let db = await getDb();

  let rows = [];
  body.tickets.forEach(el => {
      rows.push({...el, event_id: body.event_id});
  });
  console.log(rows);

  await db.event_tickets.insert(rows);
  res.send({status: "SUCCESS"})
}
  
module.exports.getEventTicketsCount = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {event_id, searchText} = req.query;
  const countQuery = ticketsCount([company_id, event_id], searchText)
  var [{count}] = await db.query(countQuery)
  res.send({count});
}
  
module.exports.getEventTickets = async function (req, res, next) {
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
  const ticketsquery = ticketsList(params, searchText);
  let data = await db.query(ticketsquery)
  res.send(data);
}
  
module.exports.updateEventTicket = async function (req, res, next) {
  let db = await getDb();
  const {id} = req.params;
  var {error, value} = joi.validate({id: id}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }
  let eventTicket = await db.event_tickets.update({id: id}, req.body);
  if (eventTicket.length > 0) {
    res.send({status: 'SUCCESS', 'id': eventTicket[0].id});
  }
  else {
    throw "Event Ticket doesn't exist";
  }
}