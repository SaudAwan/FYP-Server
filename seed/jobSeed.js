const { JOB } = require("../constant");

module.exports=[
    {
        job: JOB.POINTS_UPDATE
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