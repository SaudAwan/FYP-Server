const { JOB } = require("../constant")
const Sequelize = require('sequelize')

module.exports=function (sequelize,dataTypes){
    const jobs=sequelize.define('jobs',{
      job: {
        type: dataTypes.ENUM,
        values: Object.values(JOB),
        allowNull: false
      },
      lastExecuted: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false

      }
    },{
      freezeTableName:true
    })
    return jobs
  }