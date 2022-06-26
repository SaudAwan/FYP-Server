module.exports=(db)=>{
    const router=require('express').Router()
    const bcrypt = require('bcrypt')
    const jwt = require('jsonwebtoken')
    const saltRounds = 8
    const tokenCheck=require('../config/tokenCheck')
    const _=require('lodash')


    router.get('/api/user', (req, res) => {
        const email=req.query.email;
        db.users.findOne({
            where: {
                email
            }
        }).then(resp => {
            return res.send({user: resp});
        }).catch((e) => {
            return res.send({message: "User not found"});
        })
    });

    router.post('/api/auth/jwtverify',(req,res)=>{
        jwt.verify(req.body.token,process.env.secretKey,(e,userDetails)=>{
            if(userDetails){
                res.send({userDetails})
            }
            else{
                res.send({message: 'Invalid token'})
            }
        })
    })
    

    router.post('/api/auth/login',(req,res)=>{
        const {email}=req.body
        db.users.findOne({
            where:{email},
            attributes:['id','name','email','user_role','phone_number','is_admin','password'],
            include:[{
                model:db.companies,
                attributes:['id']
            }]
        })
        .then((user)=>{
                if(user){
                    const {id,name,email,user_role,phone_number,is_admin,password}=user.dataValues
                    const data={id,name,email,user_role,phone_number,is_admin,company_id:user.dataValues.company.dataValues.id}
                    bcrypt.compare(req.body.password,password)
                    .then((result)=>{
                        if(result==true){
                            jwt.sign(data,process.env.secretKey,{expiresIn:'1hr'},(e,token)=>{
                                if(token){
                                    res.send({token,userDetails:data})
                                } else{
                                    res.send({message:'Invalid token'})
                                }
                            })
                        } else{
                            res.send({message:'Invalid password'})
                        }
                    })
                }
            else{
                res.send({message: "User doesn't exist"})
            }
        })
    })

    router.post('/api/auth/google',(req,res)=>{
        const {email, company, role, googleId, name, details, phone}=req.body
        db.users.findOne({
            where:{email},
            attributes:['id','name','email','user_role','phone_number','is_admin','password', 'details', 'isThirdPartyAcc'],
            include:[{
                model:db.companies,
                attributes:['id']
            }]
        }).then((user) => {
            if(user){
                const {id,name,email,user_role,phone_number,is_admin,details, isThirdPartyAcc}=user.dataValues;
                if (details.googleId !== googleId ||!isThirdPartyAcc ) {
                   return res.send({message: "User not allowed!"});
                }

                const data={id,name,email,user_role,phone_number,is_admin,company_id:user.dataValues.company.dataValues.id}
                jwt.sign(data,process.env.secretKey,{expiresIn:'1hr'},(e,token)=>{
                    if(token){
                        res.send({token,userDetails:data})
                    } else{
                        res.send({message:'Invalid token'})
                    }
                })
            } else {
                db.companies.create({
                    name: company
                }).then(companyData => {
                    console.log("tesssss");
                    console.log(companyData)
                    const user = {
                        email,
                        name,
                        company_id: companyData.id,
                        user_role: 'CEO', // only CEO allowed to signup,
                        is_admin: true,
                        details,
                        isThirdPartyAcc: true,
                        phone_number: phone,
                        password: 'test'
                    }
                    return db.users.create(user);
                }).then(resp => {
                    console.log({id: resp.id});
                    console.log('tesssss')
                    const data = {
                      id: resp.id,
                      name: resp.name,
                      email: resp.email,
                      role: 'CEO',
                      phone_number: resp.phone_number,
                      company_id: resp.company_id,
                      is_admin: true,
                    };
                    console.log(data)
                    jwt.sign(
                      data,
                      process.env.secretKey,
                      { expiresIn: "1hr" },
                      (e, token) => {
                        if (token) {
                          res.send({ token, userDetails: data });
                        } else {
                          res.send({ message: "Invalid token" });
                        }
                      }
                    );
                });
            
            }
        })
    })

    router.post('/api/user/create',(req,res)=>{
        const {body}=req
        db.users.findOne({
            where:{email:body.email}
        })
        .then((user)=>{
            if(!user){
                bcrypt.hash(body.password,saltRounds,(e,hashed)=>{
                    if(hashed){
                        db.users.create(req.body)
                        .then(()=>{
                            res.send({message:'Employee created'})
                        })
                        .catch((e)=>{
                            res.send({message:'Error occured'})
                        })
                    } else {
                        res.send({message:'Error occured'})
                    }
                })
            } else{
                res.send({message:'User exists'})
            }
        })
    })

    router.get('/api/user/getall',async(req,res)=>{
        const company_id=parseInt(req.query.company_id)
        await db.users.findAll({    
            where:{company_id},
            attributes:['id','name','email','phone_number','user_role', 'points'],
            include:[{
                model:db.companies,
                attributes:['id']
            }]
        })
        .then((users)=>{
            const modifiedArray=_.reject(users,(user)=>{return user.user_role==='CEO'})
            res.send({users:modifiedArray})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.patch('/api/user/edit',(req,res)=>{
        const {userId} = req.query
        const {body} = req
        db.users.update(body,{where:{id:userId}})
        .then(()=>{
            res.send({message:'Employee updated'})
        })
        .catch((e)=>{
            res.send({message:'Error occured'})
        })
    })

    router.delete('/api/user/delete',(req,res)=>{
        db.users.destroy({where:{id:req.query.user_id}})
        .then(()=>{
            res.send({message:'Employee deleted'})
        })
        .catch((e)=>{
            res.send({message:'Error occured'})
        })
    })


    return router
}