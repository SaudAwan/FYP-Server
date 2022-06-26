const getDb = require('../../utils/db');
var joi = require('joi');
import {assosciationsList, assosciationsCount} from './query';

// ###  ASSOSCIATION ### 
module.exports.addEventAssosciation = async function (req, res, next) {
  let db = await getDb();
  const {body} = req;
  let rows = [];
  body.assosciations.forEach(element => {
      rows.push({event_id: body.event_id, assosciation_id: element.id});
  });

  const data = await db.event_assosciations.insert(rows);
  res.send({status: "SUCCESS"});
}

module.exports.getEventAssosciationsCount = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {event_id, searchText} = req.query;
  const countQuery = assosciationsCount([company_id, event_id], searchText)
  var [{count}] = await db.query(countQuery)
  res.send({count});
}

module.exports.getEventAssosciations = async function (req, res, next) {
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
  const assosciationsquery = assosciationsList(params, searchText);
  let data = await db.query(assosciationsquery)
  res.send(data);
}

module.exports.updateEventAssosciation = async function (req, res, next) {
  let db = await getDb();
  const {id} = req.params;
  var {error, value} = joi.validate({id: id}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  let eventAssosciation = await db.assosciations.update({id: id}, req.body);
  if (eventAssosciation.length > 0) {
    res.send({'id': eventAssosciation[0].id});
  }
  else {
    res.erro("Event Assosciation doesn't exist");
  }
}

module.exports.addAssosciation = async function (req, res, next) {
  let db = await getDb();
  const {body} = req;
  const {company_id} = req.user;
  
  const {error, value} = joi.validate({
    name: body.name,
    email: body.email,
    contact_number: body.contact_number
  }, {
    name: joi.string().required(),
    email: joi.string().required(),
    contact_number: joi.string().required()
  });
  if (error !== null) {
    throw error.details;
  }
  body.company_id = company_id;

  const data = await db.assosciations.insert(body);
  res.send(data);
}

module.exports.getAssosciations = async function (req, res, next) {
  let db = await getDb();
  var field = ["name", "contact_number"];
  const queryParams = req.query;
  var {sortBy, asc, limit, offset} = queryParams;
  const {company_id} = req.user;

  var params = {'deleted_at': null, company_id: company_id};
  if (queryParams.searchText) {
    params.or =  [{
      "name ILIKE": "%" + queryParams.searchText + "%",
    }, {
      "contact_number ILIKE": "%" + queryParams.searchText + "%",
    }];
  } else {
    field.forEach(col => {
      var likeColumn = col + " ILIKE";
      if (queryParams && queryParams[col]) params[likeColumn] =  "%" + queryParams[col] + "%";
    })
  }
  var data = await db.assosciations.find(params, {
    // fields: ['id', 'email', 'updated_at', 'is_admin', 'enabled', 'account_verified'],
    // order: [{
    //   field: sortBy || 'id',
    //   direction: asc ? 'asc' : 'desc',
    //   nulls: 'first'
    // }],
    // limit: limit || 10,
    // offset: offset || 0
  });
  res.send(data);
}