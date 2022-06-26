
const fs = require('fs');
const pointsUpdate = require('./points_update');
const schedule = require('node-schedule');


class JobManager {

    static executeJobs(db, sequelize) {
        fs.readdirSync('./scheduler/').filter(function (file) {
            const fileLastChar = file.substr(-1);
            return (file.indexOf('.') !== 0) && (file !== 'index.js') && (fileLastChar !== '~') && (fileLastChar !== '#');
          }).forEach((file) => {
            const module = './' + file;
            const {configs, process} = require(module);
            const sched = schedule.scheduleJob(configs.cronConfig, () => {
                process(db, sequelize).then(() => {
                  console.log(configs.name + " executed. Next execution: " + sched.nextInvocation());
                });
              });
              console.log(
                configs.name + " job scheduled. Next execution: " + sched.nextInvocation()
              );
            
          });
    }
}

module.exports = JobManager;