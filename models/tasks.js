module.exports=function (sequelize,dataTypes){
    const tasks=sequelize.define('tasks',{
      title:{
        type: dataTypes.STRING
      },
      task_description:{
        type: dataTypes.STRING
      },
      due_date:{
        type: dataTypes.DATEONLY
      },
      task_priority:{
        type: dataTypes.STRING
      },
      sub_task_enabled:{
        type:dataTypes.BOOLEAN
      },
      sub_task1:{
        type:dataTypes.STRING
      },
      sub_task2:{
        type:dataTypes.STRING
      },
      sub_task3:{
        type:dataTypes.STRING
      },
      points: {
        type: dataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 20
        }
      }, 
      status: {
        type: dataTypes.ENUM,
        values: ['Todo', 'In Progress', 'Done'],
        defaultValue: 'Todo'
      }
    },{
      freezeTableName:true
    })
    tasks.associate=(models)=>{
        tasks.belongsTo(models.users,{foreignKey:'operator_id',as:'operator',constraints:false})
        tasks.belongsTo(models.users,{foreignKey:'created_by',as:'createdBy',constraints:false})
        tasks.belongsTo(models.companies,{foreignKey:'company_id',constraints:false})
        tasks.belongsTo(models.events,{foreignKey:'event_id',constraints:false})
    }
    return tasks
  }