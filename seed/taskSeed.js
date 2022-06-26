module.exports=[
    {
        title:'Task to be done as soon as possible', task_description:'Please add speaker to the event',due_date:'2020-10-12',
        task_priority:'High',sub_task_enabled:true,sub_task1:'Do add travel and stay details as well',sub_task2:'Add revenues',
        operator_id:3,created_by:2,company_id:1,event_id:1, points: 5
    },
    {
        title:'Please have a look at the description', task_description:'Please add speaker to the event',due_date:'2020-12-10',
        task_priority:'High',sub_task_enabled:null,operator_id:3,created_by:2,company_id:1,event_id:2, points: 4
    }
]

/**
 * 
 * QUERY FOR CRON JOB 
 
UPDATE evenezytest.users u
SET u.points = u.points - (
SELECT ifnull(SUM(t.points * 0.5), 0)
    FROM evenezytest.tasks t
    WHERE  due_date < CURDATE() and status != 'Done' and operator_id = u.id
);
 */