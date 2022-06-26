const getDb = require('../../utils/db');
var joi = require('joi');
import {speakersList, speakersCount} from './query';
import { func } from 'joi';

module.exports.addEventSpeaker = async function ({body}, res, next) {
  let db = await getDb();
  let rows = [];
  body.speakers.forEach(element => {
    const {type, id, status} = element;
    rows.push({event_id: body.event_id, type: type, speaker_id: id, status: status});
  });
  const data = await db.event_speakers.insert(rows);
  res.send(data);
}

module.exports.getEventSpeakersCount = async function (req, res, next) {
  let db = await getDb();
  const {company_id} = req.user;
  const {event_id, searchText} = req.query;
  const countQuery = speakersCount([company_id, event_id], searchText)
  
  console.log(countQuery)
  var [{count}] = await db.query(countQuery)
  console.log(count)
  res.send({count});
}

module.exports.getEventSpeakers = async function (req, res, next) {
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
  const speakersquery = speakersList(params, searchText);
  let data = await db.query(speakersquery)
  res.send(data);
}

module.exports.updateEventSpeaker = async function (req, res, next) {
  let db = await getDb();
  const {id} = req.params;
  const {name,speaker_company,designation,contact_number,status}=req.body
  const event=JSON.parse(req.body.event)
  const data={
    name,
    speaker_company,
    designation,
    contact_number,
    event_id: event.id,
    status
  }
  var {error, value} = joi.validate({id: id}, {
    id: joi.number().integer().required()
  });
  if (error !== null) {
    throw error.details;
  }

  await db.speakers.update({id: id}, data);
  // await db.event_speakers.update({speaker_id: id}, {status: req.body.status});
  res.send("success");
}


module.exports.addSpeaker = async function (req, res, next) {
  let db = await getDb();
  const {body} = req;
  const eventDetails=JSON.parse(body.event)
  const {company_id,id}=eventDetails
  
  const {error, value} = joi.validate({
    speaker_company: body.speaker_company,
    company_id,
    status: body.status,
    event_id:id,
    name: body.name,
    designation: body.designation,
    contact_number: body.contact_number
  }, {
    speaker_company: joi.string().required(),
    company_id: joi.number().integer().required(),
    status: joi.string().required(),
    event_id: joi.number().integer().required(),
    name: joi.string().required(),
    designation: joi.string().required(),
    contact_number: joi.string().required()
  });
  if (error !== null) {
    throw error
  }
  const data = await db.speakers.insert(value)
  res.send({id: data.id});
}

module.exports.getSpeakers = async function (req, res, next) {
  let db = await getDb();
  var field = ['id',"name", "speaker_company"];
  const queryParams = req.query;
  const company_id = parseInt(req.query.company_id)
  var {sortBy, asc, limit, offset} = queryParams;

  var params = {'deleted_at': null, company_id: company_id};
  if (queryParams.searchText) {
    params.or =  [{
      "name ILIKE": "%" + queryParams.searchText + "%",
    }, {
      "speaker_company ILIKE": "%" + queryParams.searchText + "%",
    }];
  } else {
    field.forEach(col => {
      var likeColumn = col + " ILIKE";
      if (queryParams && queryParams[col]) params[likeColumn] =  "%" + queryParams[col] + "%";
    })
  }
  var data = await db.speakers.join({
    events:{
      type:'INNER',
      on: {id:'event_id'}
    }
  })
  .find({
    company_id
  })
  res.send(data);
}

module.exports.fetchEventSpeakers=async function(req,res){
  let db=await getDb()
  var event_id=parseInt(req.query.event_id)
  await db.speakers.find({
    event_id
  })
  .then((data)=>{
    res.send(data)
  })
  .catch((err)=>{throw err})
}