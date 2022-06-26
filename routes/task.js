const Sequelize = require('sequelize');
const SlackW = require('../utils/slack');
const moment = require('moment');
const Op = Sequelize.Op;

module.exports=(db)=>{
    const router=require('express').Router()

    router.post('/api/task/create',(req,res)=>{
        const operatorId = req.body.operator_id;
        const creatorId = req.body.created_by;

        db.users
          .findAll({
            where: {
              id: {
                [Op.in]: [operatorId, creatorId],
              },
            },
          })
          .then((users) => {
            const creator = (users || []).find(user => user.id === creatorId);
            const operator = (users || []).find(user => user.id === operatorId);

            db.tasks
              .create(req.body)
              .then((resp) => {
                const message = `${creator ? (creator.name + '<' + creator.email + '>') : 'User'} has created the task(${resp.title}), assigned to ${operator ? (operator.name + '<' + operator.email + '>') : 'Assignee'}, with ${resp.task_priority} priority and ${resp.points || 0} points. Deadline is ${req.body.due_date}.`;
                SlackW.postMessageWithWebhook('evenzy', null, message, process.env.slackWebHook);
                res.send({ message: "Task created" });
              })
              .catch((error) => {
                  console.log(error)
                res.send({ message: "Error occured" });
              });
          });
    
    })

    router.patch('/api/task/:id/status', (req, res) => {
        let points = 0;
        db.tasks.findOne({
            where:{id:req.params.id}
        })
        .then((task)=>{
            task.status = req.body.status;
            points = task.points || 0;
            return task.save();
        })
        .then(resp => {
            if (resp && resp.status == 'Done') {
                const currentDateTime = moment();
                const deadline = moment(`${resp.due_date} 11:59 PM`);

                db.users.findOne({
                    where: {
                        id: req.query.user_id
                    }
                }).then(user => {
                    let completionStatus = '';
                    if (currentDateTime <= deadline) {
                        completionStatus = '*under deadline*'
                        user.points += points;
                        user.save();
                    } else {
                        completionStatus = '*after deadline*'
                    }

                    const message = `${user ? (user.name + '<' + user.email + '>') : 'User'} has completed the task(${resp.title}) ${completionStatus}, with ${resp.task_priority} priority and ${resp.points || 0} points. Assinged deadline was ${resp.due_date}.`;
                    SlackW.postMessageWithWebhook('evenzy', null, message, process.env.slackWebHook);

                    return Promise.resolve()
                });
            }
            return Promise.resolve({});
        }).then(()=>{
            res.send({message:'Task status updated'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    });

    router.get('/api/task/getall',(req,res)=>{
        db.tasks.findAll({
            where:{company_id:req.query.company_id},
            attributes:[
                'id','title','task_description','due_date','task_priority',
                'sub_task_enabled','sub_task1','sub_task2','sub_task3','points', 'status', 'operator_id'
            ],
            include:[
                {
                    model:db.users,
                    as:'operator',
                    attributes:['id','name']
                },
                {
                    model:db.users,
                    as:'createdBy',
                    attributes:['id','name']
                },
                {
                    model:db.events,
                    attributes:['id','name']
                }
            ]
        })
        .then((tasks)=>{
            res.send({data:tasks})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/task/employee/getall',(req,res)=>{
        db.tasks.findAll({
            where:{operator_id:req.query.operator_id},
            attributes:[
                'id','title','task_description','due_date','task_priority',
                'sub_task_enabled','sub_task1','sub_task2','sub_task3'
            ],
            include:[
                {
                    model:db.users,
                    as:'operator',
                    attributes:['id','name']
                },
                {
                    model:db.users,
                    as:'createdBy',
                    attributes:['id','name']
                },
                {
                    model:db.events,
                    attributes:['id','name']
                }
            ]
        })
        .then((tasks)=>{
            res.send({data:tasks})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.get('/api/task/comment/getall',(req,res)=>{
        console.log(req.query)
        db.task_comments.findAll({
            where:{task_id:req.query.task_id},
            include:[
                {
                    model:db.users,
                    attributes:['id','name']
                }
            ]
        })
        .then((comments)=>{
            res.send({comments})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.post('/api/task/comment/create',(req,res)=>{
        db.task_comments.create(req.body)
        .then(()=>{
            res.send({message:'Comment created'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.delete('/api/task/comment/delete',(req,res)=>{
        db.task_comments.destroy({
            where:{id:req.query.comment_id}
        })
        .then(()=>{
            res.send({message:'Comment deleted'})
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    router.delete('/api/task/delete',(req,res)=>{
        db.tasks.destroy({
            where:{id:req.query.task_id}
        })
        .then(()=>{
            db.task_comments.destroy({where:{task_id:req.query.task_id}})
            .then(()=>{
                res.send({message:'Task deleted'})
            })
            .catch(()=>{
                res.send({message:'Error occured'})
            })
        })
        .catch(()=>{
            res.send({message:'Error occured'})
        })
    })

    return router
}