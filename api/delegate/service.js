const getDb = require('../../utils/db');
var joi = require('joi');
import {delegatesList, delegatesCount} from './query';

module.exports.addDelegate = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {body} = req;

  const {error, value} = joi.validate({
    delegate_company: body.delegate_company,
    name: body.name,
    designation: body.designation,
    contact_number: body.contact_number
  }, {
    delegate_company: joi.string().required(),
    name: joi.string().required(),
    designation: joi.string().required(),
    contact_number: joi.string().required()
  });
  if (error !== null) {
    throw error.details;
  }
  body.company_id = company_id;

  const data = await db.delegates.insert(body);
  res.send(data)
}

module.exports.getDelegates = async function (req, res, next) {
  let db = await getDb();
  var field = ["name", "delegate_company"];
  const {company_id} = req.user;
  const queryParams = req.query;
  var {sortBy, asc, limit, offset} = queryParams;

  var params = {'deleted_at': null, company_id: company_id};
  if (queryParams.searchText) {
    params.or =  [{
      "name ILIKE": "%" + queryParams.searchText + "%",
    }, {
      "delegate_company ILIKE": "%" + queryParams.searchText + "%",
    }];
  } else {
    field.forEach(col => {
      var likeColumn = col + " ILIKE";
      if (queryParams && queryParams[col]) params[likeColumn] =  "%" + queryParams[col] + "%";
    })
  }
  var data = await db.delegates.find(params, {
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

module.exports.getDelegateCategories = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  
  const data = await db.delegate_categories.find({}, {
      fields: ['id', 'name'],
      order: [{
          field: 'id',
          direction: 'asc',
          nulls: 'first'
      }]
  });
  res.send(data)
}

module.exports.addEventDelegate = async function (req, res, next) {
  let db = await getDb();
  const {body} = req;
  console.log(body);

  let rows = [];
  body.delegates.forEach(element => {
      rows.push({event_id: body.event_id, delegate_id: element.id, category_id: element.category});
  });
  console.log(rows);

  const data = await db.event_delegates.insert(rows);
  res.send(data);
}

module.exports.getEventDelegate = async function (req, res, next) {
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
  const delegatesquery = delegatesList(params, searchText);
  let data = await db.query(delegatesquery)
  res.send(data);
}

module.exports.updateEventDelegate = async function (req, res, next) {
  let db = await getDb();
  const {id} = req.params;
  var {error, value} = joi.validate({id: id}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }
  let eventDelegate = await db.delegates.update({id: parseInt(id)}, req.body);
  if (eventDelegate.length > 0) {
    res.send({'id': eventDelegate[0].id});
  }
  else {
    res.error({err: "Event Delegate doesn't exist"});
  }
}

module.exports.getEventDelegatesCount = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {event_id, searchText} = req.query;
  const countQuery = delegatesCount([company_id, event_id], searchText)
  var [{count}] = await db.query(countQuery)
  res.send({count});
}
  