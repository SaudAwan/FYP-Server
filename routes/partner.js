module.exports=(db)=>{
    const router=require('express').Router()

    router.post('/api/partner/create',(req,res)=>{
        db.partners.create(req.body)
        .then(()=>{
            res.send({message:'Partner created'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/partner/getall',(req,res)=>{
        db.partners.findAll({
            where:{company_id:req.query.company_id},
            attributes:['id','name','email','contact_number','partner_company'],
            include:[{
                model: db.events,
                attributes:['id','name']
            }]
        })
        .then((partners)=>{
            res.send({data:partners})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.patch('/api/partner/update',(req,res)=>{
        db.partners.update(req.body,{where:{id:req.query.partner_id}})
        .then(()=>{
            res.send({message:'Partner updated'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    return router
}