const getDb = require('../../utils/db');
var joi = require('joi');
import {mediaPartnersList, mediaPartnersCount} from './query';

module.exports.addMediaPartner = async function (req, res, next) {
  let db = await getDb();
  const company_id=parseInt(req.query.company_id)
  const {body} = req;
  const event=JSON.parse(req.body.event)
  const event_id=event.id
  const {error, value} = joi.validate({
    media_partner_company: body.media_partner_company,
    company_id,
    event_id,
    name: body.name,
    email: body.email,
    contact_number: body.contact_number
  }, {
    media_partner_company: joi.string().required(),
    company_id: joi.number().integer().required(),
    event_id: joi.number().integer().required(),
    name: joi.string().required(),
    email: joi.string().required(),
    contact_number: joi.string().required()
  });
  if (error != null) {
    throw error
  }
  const data = await db.media_partners.insert(value);
  // const {id}=data
  // const object={
  //   event_id,
  //   media_partner_id: id
  // }
  // await db.event_media_partners.insert(object)
  // .then(()=>res.send(data))
  res.send(data)
  
}
  
module.exports.addEventMediaPartner = async function (req, res, next) {
  let db = await getDb();
  console.log(body);
  const {body} = req

  let rows = [];
  body.media_partners.forEach(element => {
    rows.push({event_id: body.event_id, type: element.type, media_partner_id: element.id});
  });
  console.log(rows);

  await db.event_media_partners.insert(rows);
  res.send({status: "SUCCESS"})
}


module.exports.getMediaPartners = async function (req, res, next) {
  let db = await getDb();
  var field = ["name", "media_partner_company"];
  const company_id= parseInt(req.query.company_id);
  const queryParams = req.query;
  var {sortBy, asc, limit, offset, searchText} = queryParams;
  var params = {'deleted_at': null, company_id: company_id};
  if (searchText) {
    params.or =  [{
      "name ILIKE": "%" + searchText + "%",
    }, {
      "media_partner_company ILIKE": "%" + searchText + "%",
    }];
  } else {
    field.forEach(col => {
      var likeColumn = col + " ILIKE";
      if (queryParams && queryParams[col]) params[likeColumn] =  "%" + queryParams[col] + "%";
    })
  }
  var resp=await db.media_partners.join({
    events:{
      type:'INNER',
      on: {id: 'event_id'}
    }
  })
  .find({
    company_id
  })
  // var resp = await db.media_partners.find(params, {
    // fields: ['id', 'email', 'updated_at', 'is_admin', 'enabled', 'account_verified'],
    // order: [{
    //   field: sortBy || 'id',
    //   direction: asc ? 'asc' : 'desc',
    //   nulls: 'first'
    // }],
    // limit: limit || 10,
    // offset: offset || 0
  // });
  // console.log(resp)
  res.send(resp);
}
  
module.exports.getEventMediaPartnersCount = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {event_id, searchText} = req.query;
  const countQuery = mediaPartnersCount([company_id, event_id], searchText)
  var [{count}] = await db.query(countQuery)
  res.send({count});
}

module.exports.getEventMediaPartners = async function (req, res, next) {
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
  const speakersquery = mediaPartnersList(params, searchText);
  let data = await db.query(speakersquery)
  res.send(data);
}
  
  module.exports.updateMediaPartner = async function (req, res, next) {
    const id=parseInt(req.params.id)
    console.log(id)
    let db = await getDb();
    const event=JSON.parse(req.body.event)
    const event_id=event.id
    const company_id=event.company_id
    const {name,email,contact_number,media_partner_company}=req.body
    var {error, value} = joi.validate({
      name,
      email,
      event_id,
      contact_number,
      media_partner_company,
      company_id
    }, {
      name: joi.string().required(),
      email: joi.string().required(),
      event_id: joi.number().integer().required(),
      contact_number: joi.string().required(),
      media_partner_company: joi.string().required(),
      company_id: joi.number().integer().required()
      
    });
    if (error !== null) {
      throw error.details;
    }
    let eventMediaPartner = await db.media_partners.update({id}, value);
    if (eventMediaPartner.length > 0) {
      res.send({status: 'SUCCESS', 'id': eventMediaPartner[0].id});
    }
    else {
      throw "Event MediaPartner doesn't exist";
    }
  }
  
module.exports.getMediaPartnerTypes = async function (req, res, next) {
    let db = await getDb();
    const {company_id} = req.user;
    const data = await db.media_partner_types.find({company_id: company_id}, {
        fields: ['id', 'name'],
        order: [{
            field: 'id',
            direction: 'asc',
            nulls: 'first'
        }]
    });
    res.send(data)
  }