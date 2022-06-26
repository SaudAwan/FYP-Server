const getDb = require('../../utils/db')
var joi = require('joi')

module.exports.addTask=async function(req,res){
    let db=await getDb()
    const {body}=req
    const event=JSON.parse(req.body.event)
    const operator=JSON.parse(req.body.operator)
    const company_id=parseInt(req.query.company_id)
    const created_by=parseInt(req.query.created_by)
    const user_id=parseInt(req.query.user_id)
    const {error,value}=joi.validate({
        title: body.title,
        task_description: body.task,
        operator: operator.id,
        due_date:body.due_date,
        event_id:event.id,
        company_id,
        task_priority: body.task_priority,
        sub_task0: body.sub_task0,
        sub_task1: body.sub_task1,
        sub_task2: body.sub_task2,
        sub_task3: body.sub_task3,
        sub_task4: body.sub_task4,
        sub_task5: body.sub_task5,
        sub_task6: body.sub_task6,
        sub_task7: body.sub_task7,
        sub_task8: body.sub_task8,
        sub_task9: body.sub_task9,
    },{
        title: joi.string().required(),
        task_description: joi.string().required(),
        operator: joi.number().integer().required(),
        due_date: joi.date(),
        event_id: joi.number().integer().required(),
        company_id: joi.number().integer().required(),
        task_priority: joi.string(),
        sub_task0: joi.string(),
        sub_task1: joi.string(),
        sub_task2: joi.string(),
        sub_task3: joi.string(),
        sub_task4: joi.string(),
        sub_task5: joi.string(),
        sub_task6: joi.string(),
        sub_task7: joi.string(),
        sub_task8: joi.string(),
        sub_task9: joi.string(),
    })
    if(error != null){
        throw error
    }
    const data = await db.tasks.insert(value);
    res.send(data)
}

module.exports.getTasks= async function (req,res){
    let db=await getDb()
    const company_id=parseInt(req.query.company_id)
    const data=await db.tasks.join({
        events:{
            type:'INNER',
            on: {id: 'event_id'}
        },
        users:{
            type:'INNER',
            on:{id:'operator'}
        }
    })
    .find({
        company_id
    })
    res.send(data)
}

module.exports.getSingleTask=async function(req,res){
    let db=await getDb()
    const id = parseInt(req.query.task_id)
    const data=await db.tasks.join({
        events:{
            type:'INNER',
            on: {id: 'event_id'}
        },
        users:{
            type:'INNER',
            on:{id:'operator'}
        }
    })
    .find({
        id
    })
    res.send(data)
}

module.exports.addTaskComment=async function(req,res){
    let db=await getDb()
    const {body,query}=req
    const user_id=parseInt(query.user_id)
    const task_id=parseInt(query.task_id)
    const {error,value}=joi.validate({
        commentor_id: user_id,
        task_id,
        comment: body.comment
        
      },{
        commentor_id: joi.number().integer().required(),
        task_id: joi.number().integer().required(),
        comment: joi.string().required()
        
      })

      if(error != null){
        throw error
      }
    const data = await db.task_comments.insert(value)
    res.send(data)
    
}

module.exports.getTaskComments=async function(req,res){
    let db=await getDb()
    const id=parseInt(req.query.task_id)
    const data = await db.task_comments.join({
        users:{
            type: 'INNER',
            on: {id:'commentor_id'}
        }
    })
    .find({
        task_id:id
    })
    res.send(data)
}