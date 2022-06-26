const getDb = require('../../utils/db')
var joi = require('joi')
const {google} = require('googleapis')
const oauth2Client = new google.auth.OAuth2(
  '445843530428-mr2snf20c0f5vsvqe315qhlp4op15ckh.apps.googleusercontent.com',
  'GoV3J4MpmW72cdXGPwZfxJV3',
  'https://04749450.ngrok.io/api/agenda/sessions/googledrive/oauth/callback'
)
var fs = require('fs')
var jsonToCsv=require('json2csv').parse
module.exports.addAgenda=async function(req,res){
    let db=await getDb()
    const {body}=req
    const event=JSON.parse(req.body.event)
    const company_id=parseInt(req.query.company_id)
    const user_id=parseInt(req.query.user_id)
    const {error,value}=joi.validate({
        title: body.title,
        status: body.status,
        event_id:event.id,
        company_id,
        created_by:user_id
    },{
        title: joi.string().required(),
        status: joi.string().required(),
        event_id: joi.number().integer().required(),
        company_id: joi.number().integer().required(),
        created_by: joi.number().integer().required()
    })
    if(error != null){
        throw error
    }
    const data = await db.agendas.insert(value);
    res.send(data)
}

module.exports.getAgendas=async function(req,res){
    let db=await getDb()
    const company_id=parseInt(req.query.company_id)
    const data=await db.agendas.join({
        events:{
            type:'INNER',
            on: {id: 'event_id'}
        },
        users:{
            type:'INNER',
            on:{id:'created_by'}
        }
    })
    .find({
        company_id
    })
    res.send(data)
}

module.exports.updateAgenda=async function(req,res){
    let db=await getDb()
    const {body}=req
    const event=JSON.parse(req.body.event)
    const agenda_id=parseInt(req.query.agenda_id)
    const company_id=parseInt(req.query.company_id)
    const user_id=parseInt(req.query.user_id)
    const {error,value}=joi.validate({
        title: body.title,
        status: body.status,
        event_id:event.id,
        company_id,
        created_by:user_id
    },{
        title: joi.string().required(),
        status: joi.string().required(),
        event_id: joi.number().integer().required(),
        company_id: joi.number().integer().required(),
        created_by: joi.number().integer().required()
    })
    let agenda = await db.agendas.update({id:agenda_id}, value);
    if (agenda.length > 0) {
      res.send({status: 'SUCCESS', 'id': agenda[0].id});
    }
    else {
      throw "Event MediaPartner doesn't exist";
    }
}

module.exports.fetchSessionDays=async function(req,res){
    let db=await getDb()
    const agenda_id=parseInt(req.query.agenda_id)
    const data=await db.agenda_session_days.find({
        agenda_id
    })
    res.send(data)
}

module.exports.addSessionDay=async function(req,res){
    let db=await getDb()
    const agenda_id=parseInt(req.query.agenda_id)
    const {body}=req
    const {error,value}=joi.validate({
        session_day: body.session_day,
        agenda_id,
    },{
        session_day: joi.string().required(),
        agenda_id: joi.number().integer().required()
    })
    if(error != null){
        throw error
    }
    const data=await db.agenda_session_days.insert(value)
    res.send(data)
}

module.exports.deleteSessionDay=async function(req,res){
    let db=await getDb()
    const id=parseInt(req.params.id)
    await db.agenda_sessions.destroy({
        session_day_id:id
    })
    const data=await db.agenda_session_days.destroy({
        id
    })
    res.send(data)
}

module.exports.addSession=async function(req,res){
    let db=await getDb()
    const {body}=req
    const {query}=req
    const agenda_id=parseInt(query.agenda_id)
    const session_day_id=parseInt(query.session_day_id)
    const speaker=JSON.parse(body.speaker)
    const speaker_id=speaker.id
    const {error,value}=joi.validate({
        timing: body.timing,
        session_name:body.session,
        speaker_id,
        agenda_id,
        session_day_id
    },{
        timing: joi.string().required(),
        session_name: joi.string().required(),
        speaker_id: joi.number().integer().required(),
        agenda_id: joi.number().integer().required(),
        session_day_id: joi.number().integer().required()
    })
    if(error != null){
        throw error
    }
    const data=await db.agenda_sessions.insert(value)
    res.send(data)
}

module.exports.updateSession=async function(req,res){
    let db=await getDb()
    const {body}=req
    const speaker=JSON.parse(body.speaker)
    const speaker_id=speaker.id
    const agenda_id=parseInt(req.query.agenda_id)
    const session_day_id=parseInt(req.query.session_day_id)
    const {error,value}=joi.validate({
        timing: body.timing,
        session_name:body.session,
        speaker_id,
        agenda_id,
        session_day_id
    },{
        timing: joi.string().required(),
        session_name: joi.string().required(),
        speaker_id: joi.number().integer().required(),
        agenda_id: joi.number().integer().required(),
        session_day_id: joi.number().integer().required()
    })
    if(error != null){
        throw error
    }
    console.log(value)
    let data = await db.agenda_sessions.update({agenda_id,session_day_id}, value)
    console.log(data)
    res.send(data)
}

module.exports.getSessions=async function(req,res){
    let db=await getDb()
    const {query}=req
    const agenda_id=parseInt(query.agenda_id)
    const session_day_id=parseInt(query.session_day_id)
    await db.agenda_sessions.join({
        speakers:{
            type:'INNER',
            on:{id: 'speaker_id'}
        }
    })
    .find({
        session_day_id
    })
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        throw err
    })
}

module.exports.openGoogleDrive=async function(req,res){
    // const scopes = [
    //     'https://www.googleapis.com/auth/blogger',
    //     'https://www.googleapis.com/auth/calendar'
    //   ];
      
      const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
      
        // If you only need one scope you can pass it as a string
        scope: 'https://www.googleapis.com/auth/drive'
      });
      res.json(url)
}

module.exports.googleDriveCallback=(nsp)=> async function (req,res){
    await oauth2Client.getToken(req.query.code)
    .then(({tokens})=>{
        oauth2Client.setCredentials(tokens)
        nsp.emit('credentialsSet','true')
    })
    .catch((e)=>{
        throw e
    })
}

module.exports.googleDriveUpload = async function (req,res){
    const agenda_id=parseInt(req.query.agenda_id)
    let db=await getDb()
    await db.agenda_sessions.find({
        agenda_id
    })
    .then(async(data)=>{
        console.log('abc')
        const csv=jsonToCsv(data,{fields: ['Timing','Session']})
        fs.writeFileSync('./csv/agendaSessions.csv',csv)
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        })
        await drive.files.create({
            requestBody: {
              name: 'Evenezy',
              mimeType: 'text/csv'
            },
            media: {
              mimeType: 'text/csv',
              body: fs.createReadStream('./csv/agendaSessions.csv')
            }
        })
        .then((resp)=>{
            res.send({message: 'File uploaded'})
        })
        .catch((err)=>{
            throw err
        })
    })
    .catch((err)=>{throw err})
}