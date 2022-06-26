const { v4: uuidv4 } = require('uuid');
const { sendMail } = require('../utils/mailer');
const QRCode = require('qrcode');
const constants = require('../constant');

module.exports=(db)=>{
    const router=require('express').Router()
    const bcrypt = require('bcrypt')
    const jwt = require('jsonwebtoken')
    const saltRounds = 8
    const tokenCheck=require('../config/tokenCheck')
    
    router.post('/api/event/create',(req,res)=>{
        req.body.eventKey = uuidv4();
        db.events.create(req.body)
        .then(async(event)=>{
            db.teams.findOne({where:{id:event.dataValues.team_id}})
            .then((team)=>{
                const {id,name,created_by,company_id}=team.dataValues
                const data={id,name,created_by,company_id,event_id:event.dataValues.id}
                db.teams.update(data,{where:{id}})
                .then(()=>{
                    res.send({message:'Event created'})
                })
                .catch(()=>{
                    res.send({message:'Error occured'})
                })
            })
            
        })
        .catch((e)=>{
            console.log(e)
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/event/getall',(req,res)=>{
        db.events.findAll({
            where:{company_id: req.query.company_id},
            attributes:[
                'id','name','category_id','start_date','end_date','location',
                'target_revenue','sponsorship','delegate_sales','marketing','team_id',
                'eventKey'
            ]
        })
        .then((events)=>{
            res.send({events})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/event/categories/getall',(req,res)=>{
        db.event_categories.findAll({
            attributes:['id','name']
        })
        .then((categories)=>{
            res.send({categories})
        })
        .catch(()=>{res.send({message:'Error occured'})})
    })

    router.get('/api/event/employeeevents/getall',(req,res)=>{
        db.team_users.findOne({where:{user_id:req.query.employee_id}})
        .then((user)=>{
            db.events.findAll({
                where:{team_id:user.dataValues.team_id},
                attributes:['id','name']
            })
            .then((events)=>{
                res.send({events})
            })
            .catch(()=>{
                res.send({message:'Error occured'})
            })
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })


    router.get('/api/event/:id', (req, res) => {
        db.events.findOne({where:{eventKey:req.params.id}})
        .then((event)=>{
            res.send({event})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    });

    router.post("/api/event/:key/book", (req, res) => {
      db.events
        .findOne({
          eventKey: req.params.key || "xyz",
        })
        .then(async (event) => {
          req.body.eventName = event.name;
          req.body.event_id = event.id;
          return db.event_bookings.create(req.body);
        })
        .then(() => {
          const qrData = {
            userName: req.body.name,
            email: req.body.email,
            eventName: req.body.eventName,
            eventId: req.body.event_id,
            bookedOn: new Date().toISOString(),
          };
          return QRCode.toDataURL(JSON.stringify(qrData));
        })
        .then((url) => {
          const payload = {
            userName: req.body.name,
            email: req.body.email,
            eventName: req.body.eventName,
            to: req.body.email,
            qrCode: url,
          };
          // qrCode
          sendMail(constants.EMAIL_TEMPLATE.BOOK_EVENT_TEMPLATE, payload);
          db.emailAddresses.create({
              address: req.body.email
          });
          res.send({ message: "Event Booked" });
        })
        .catch((e) => {
          console.log(e);
          res.send({ message: "Error occured" });
        });
    });

    return router
}