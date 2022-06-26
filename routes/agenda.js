module.exports=(db)=>{
    const router=require('express').Router()
    // const joi=require('joi')
    // const {google} = require('googleapis')
    // const oauth2Client = new google.auth.OAuth2(
    // '445843530428-mr2snf20c0f5vsvqe315qhlp4op15ckh.apps.googleusercontent.com',
    // 'GoV3J4MpmW72cdXGPwZfxJV3',
    // 'https://04749450.ngrok.io/api/agenda/sessions/googledrive/oauth/callback'
    // )
    // var fs = require('fs')
    // var jsonToCsv=require('json2csv').parse

    router.post('/api/agenda/create',(req,res)=>{
        db.agendas.create(req.body)
        .then(()=>{
            res.send({message:'Agenda created'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/agenda/getall',(req,res)=>{
        db.agendas.findAll({
            where:{company_id:req.query.company_id},
            attributes:['id','title','status'],
            include:[
                {
                    model:db.users,
                    attributes:['id','name']
                },
                {
                    model:db.events,
                    attributes:['id','name']
                }
            ]
        })
        .then((agendas)=>{
            res.send({data:agendas})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.patch('/api/agenda/update',(req,res)=>{
        db.agendas.update(req.body,{
            where:{id:req.query.agenda_id}
        })
        .then(()=>{
            res.send({message:'Agenda updated'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/agenda/session/day/getall',(req,res)=>{
        db.agenda_session_days.findAll({
            where:{agenda_id:req.query.agenda_id},
            attributes:['id','session_day']
        })
        .then((sessionDays)=>{
            res.send({sessionDays})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.post('/api/agenda/session/day/create',(req,res)=>{
        db.agenda_session_days.create(req.body)
        .then(()=>{
            res.send({message:'Session day created'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.delete('/api/agenda/session/day/delete',(req,res)=>{
        db.agenda_sessions.destroy({where:{session_day_id:req.query.session_day_id}})
        .then(()=>{
            db.agenda_session_days.destroy({where:{id:req.query.session_day_id}})
            .then(()=>{
                res.send({message:'Session day deleted'})
            })
            .catch(()=>{
                res.send({message:'Error occured'})
            })
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })
    router.post('/api/agenda/session/create',(req,res)=>{
        db.agenda_sessions.create(req.body)
        .then(()=>{
            res.send({message:'Session created'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/agenda/session/getall',(req,res)=>{
        const {session_day_id,agenda_id}=req.query
        db.agenda_sessions.findAll({
            where:{agenda_id,session_day_id},
            attributes:['id','timing','session_name'],
            include:[
                {
                    model: db.speakers,
                    attributes:['id','name']
                }
            ]
        })
        .then((sessions)=>{
            res.send({data:sessions})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.patch('/api/agenda/session/update',(req,res)=>{
        db.agenda_sessions.update(req.body,{where:{id:req.query.session_id}})
        .then(()=>{
            res.send({message:'Session updated'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    return router
}