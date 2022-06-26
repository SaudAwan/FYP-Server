const getDb = require('../../utils/db');
var joi = require('joi');
import {inventoryList, inventoryCount} from './query';

module.exports.addInventory = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {body} = req;
  const {error, value} = joi.validate({
    item: body.item,
    location: body.location,
    quantity: body.quantity,
    status: body.status
  }, {
    item: joi.string().required(),
    location: joi.string().required(),
    quantity: joi.string().required(),
    status: joi.string().required()
  });
  if (error !== null) {
    throw error.details;
  }
  body.company_id = company_id;

  const data = await db.event_inventory.insert(body);
  res.send(data);
}
  
module.exports.getInventory = async function (req, res, next) {
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
  var resp = await db.event_inventory.find(params, {
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

// ### INVENTORY
module.exports.addEventInventory = async function (req, res, mext) {
  let db = await getDb();
  const body = req.body;
  const {company_id} = req.user;
  const {error, value} = joi.validate({
    item: body.item,
    quantity: body.quantity,
    status: body.status,
    location: body.location
  }, {
    item: joi.string().required(),
    quantity: joi.string().required(),
    status: joi.string().required(),
    location: joi.string().required(),
  });
  if (error !== null) {
    throw error.details;
  }
  body.event_id = event_id;
  body.company_id = company_id;
  body.status_id = 1;
  body.specification = "data";
  await db.event_inventory.insert(body);
  res.send("success")
}

module.exports.getEventInventoryCount = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {event_id, searchText} = req.query;
  const countQuery = inventoryCount([company_id, event_id], searchText)
  var [{count}] = await db.query(countQuery)
  res.send({count});
}
  
module.exports.getEventInventory = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  let {searchText, field, order, limit, page, event_id} = req.query;
  limit = limit || 10;
  const offset = page ? (page - 1) * limit : 0
  const params = [company_id, event_id, limit, offset];
  if (field) {
    params.push(field);
  } else {
    params.push('item');
  }
  if (order) {
    params.push(order === "asc" ? 'ASC' : 'DESC');
  } else {
    params.push('ASC');
  }
  const inventoryquery = inventoryList(params, searchText);
  let data = await db.query(inventoryquery)
  res.send(data);
}

module.exports.updateEventInventory = async function (req, res, next) {
  let db = await getDb();
  const {id} = req.params;
  const body = req.body;
  var {error, value} = joi.validate({id: id}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  let eventInventory = await db.event_inventory.update({id: id}, body);
  if (eventInventory.length > 0) {
    return {'id': eventInventory[0].id};
  }
  else {
    throw "Event Inventory doesn't exist";
  }
}
