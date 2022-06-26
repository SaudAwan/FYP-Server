module.exports=(db)=>{
    const router=require('express').Router()
    const tokenCheck=require('../config/tokenCheck')

    router.post('/api/speaker/create',(req,res)=>{
        db.speakers.create(req.body)
        .then(()=>{
            res.send({message: 'Speaker created'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/speaker/getall',(req,res)=>{
        db.speakers.findAll({
            where:{company_id:req.query.company_id},
            attributes:[
                'id','name','designation','email','contact_number','status','speaker_company','enable_travel_and_stay',
                'boarding_point','destination'
            ],
            include:[
                {
                    model:db.events,
                    attributes:['id','name']
                }
            ]
        })
        .then((speakers)=>{
            res.send({data:speakers})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.patch('/api/speaker/update',(req,res)=>{
        const {
            name,event,email,speaker_company,designation,contact_number,status,boarding_point,
            destination,stay_start_date,stay_end_date,travel_start_date,travel_end_date,
            company_id,enable_travel_and_stay
        }=req.body

        const parsedEvent=JSON.parse(event)

        const data={
            name,event_id:parsedEvent.id,email,speaker_company,designation,contact_number,status,boarding_point,
            destination,stay_start_date,stay_end_date,travel_start_date,travel_end_date,
            company_id,enable_travel_and_stay
        }
        db.speakers.update(data,{where: {id:req.query.speaker_id}})
        .then(()=>{
            res.send({message:'Speaker updated'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/speaker/event/getall',(req,res)=>{
        db.speakers.findAll({
            where:{event_id:req.query.event_id}
        })
        .then((speakers)=>{
            res.send({speakers})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    return router
}