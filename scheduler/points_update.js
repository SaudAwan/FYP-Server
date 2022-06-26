const schedule = require('node-schedule');
const { JOB } = require('../constant');
const moment = require('moment')

const process = (db, sequelize) => {
    return db.jobs.findOne({
        where: {
            job: JOB.POINTS_UPDATE
        }
    }).then(job => {

        if (!job || !job.lastExecuted || moment(moment()).diff(job.lastExecuted, 'hours') < 24) {
            return;
        };

        // update points
        sequelize.query(`
            UPDATE evenezytest.users u
            SET u.points = u.points - (
                SELECT ifnull(SUM(t.points * 0.5), 0)
                    FROM evenezytest.tasks t
                    WHERE  due_date < CURDATE() and status != 'Done' and operator_id = u.id
        );`);

        // update job last execute
        job.lastExecuted = new Date();
        return job.save();
    });
}



module.exports = {
    configs: {
        cronConfig: "0 0 * * *",
        name: JOB.POINTS_UPDATE
    },
    process
};