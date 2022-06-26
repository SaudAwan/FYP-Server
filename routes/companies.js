module.exports=(db)=>{
    const router=require('express').Router()

    router.get('/api/companies',(req,res)=>{
        db.companies.findAll({})
        .then((resp)=> {
            return res.send({companies: resp})
        })
        .catch((e)=>{
            res.send({message: 'Error occured'})
        })
    })
    return router
}