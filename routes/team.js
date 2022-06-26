module.exports=(db)=>{
    const router=require('express').Router()
    const tokenCheck=require('../config/tokenCheck')
    const _=require('lodash')
    router.post('/api/team/create',(req,res)=>{
        const {body}=req
        const {company_id,user_id}=req.query
        db.teams.create({
            company_id,
            name:body.name,
            created_by: user_id
        })
        .then(async(team)=>{
            const {id}=team.dataValues

            await body.production.map(user => db.team_users.create({
                team_id: id,
                user_id: user,
                team_role_id: 1
            }))
            await body.operations.map(user => db.team_users.create({
                team_id: id,
                user_id: user,
                team_role_id: 2
            }))
            await body.sponsorship_sales.map(user => db.team_users.create({
                team_id: id,
                user_id: user,
                team_role_id: 3
            }))
            await body.delegate_sales.map(user => db.team_users.create({
                team_id: id,
                user_id: user,
                team_role_id: 4
            }))
            await body.marketing.map(user => db.team_users.create({
                team_id: id,
                user_id: user,
                team_role_id: 5
            }))
            res.send({message:'Team created'})
        })
        .catch((e)=>{
            res.send({message: 'Error occured'})
        })
    })

    router.get('/api/team/getall',(req,res)=>{
        db.teams.findAll({
            where:{company_id:req.query.company_id},
            attributes:['id','name','created_by','company_id'],
            include:[
                {
                    model:db.users,
                    attributes:['id','name']
                },{
                    model:db.events,
                    attributes:['id','name']
                }
            ]
        })
        .then((teams)=>{
            res.send({teams})
        })
        .catch((e)=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/team/users/getall',(req,res)=>{
        db.team_users.findAll({
            where: {team_id:req.query.team_id},
            attributes:['id','team_id','team_role_id','user_id'],
            include:[
                {
                    model:db.users,
                    attributes:['id','name']
                },{
                    model:db.team_roles,
                    attributes:['id','name']
                }
            ]
        })
        .then((teamUsers)=>{
            res.send({teamUsers})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    return router
}