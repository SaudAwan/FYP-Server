const getDb = require('../../utils/db');
var joi = require('joi');
import {sponsorsList, sponsorsCount} from './query';

module.exports.addSponsor = async function (req, res, next) {
    let db = await getDb();
    const {company_id} = req.user;
    const {body} = req;
    const {error, value} = joi.validate({
      sponsor_company: body.sponsor_company,
      name: body.name,
      designation: body.designation,
      contact_number: body.contact_number
    }, {
      sponsor_company: joi.string().required(),
      name: joi.string().required(),
      designation: joi.string().required(),
      contact_number: joi.string().required()
    });
    if (error !== null) {
      throw error.details;
    }
    body.company_id = company_id;
  
    await db.sponsors.insert(body);
    res.send({status: "success"});
  }
  
  module.exports.getSponsors = async function (req, res, next) {
    let db = await getDb();
    var field = ["name", "sponsor_company"];
    const {company_id} = req.user;
    const queryParams = req.query;
    var {sortBy, asc, limit, offset, searchText} = queryParams;
    var params = {'deleted_at': null, company_id: company_id};
    if (searchText) {
      params.or =  [{
        "name ILIKE": "%" + searchText + "%",
      }, {
        "sponsor_company ILIKE": "%" + searchText + "%",
      }];
    } else {
      field.forEach(col => {
        var likeColumn = col + " ILIKE";
        if (queryParams && queryParams[col]) params[likeColumn] =  "%" + queryParams[col] + "%";
      })
    }
    var resp = await db.sponsors.find(params, {
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

module.exports.addEventSponsor = async function ({body}, res, next) {
    let db = await getDb();
    console.log(body);
  
    let rows = [];
    body.sponsors.forEach(element => {
        rows.push({event_id: body.event_id, type: element.type, sponsor_id: element.id});
    });
    console.log(rows);
  
    await db.event_sponsors.insert(rows);
    res.send({status: "SUCCESS"})
  }

module.exports.eventSponsorsCount = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {event_id, searchText} = req.query;
  const countQuery = sponsorsCount([company_id, event_id], searchText)
  var [{count}] = await db.query(countQuery)
  res.send({count});
}
  
module.exports.getEventSponsor = async function (req, res, next) {
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
    const sponsorsquery = sponsorsList(params, searchText);
    let data = await db.query(sponsorsquery)
    res.send(data);
  }
  
  module.exports.updateEventSponsor = async function (req, res, next) {
    let db = await getDb();
    const {id} = req.params;
    var {error, value} = joi.validate({id: id}, {
      id: joi.number().integer().required()
    });
    if (error !== null) {
      throw error.details;
    }
    let eventSponsor = await db.sponsors.update({id: id}, req.body);
    if (eventSponsor.length > 0) {
      res.send({status: 'SUCCESS', 'id': eventSponsor[0].id});
    }
    else {
      throw "Event Sponsor doesn't exist";
    }
  }
  
module.exports.getSponsorTypes = async function (req, res, next) {
    let db = await getDb();
    const {company_id} = req.user;
    const data = await db.sponsor_types.find({company_id: company_id}, {
        fields: ['id', 'name'],
        order: [{
            field: 'id',
            direction: 'asc',
            nulls: 'first'
        }]
    });
    res.send(data)
  }