module.exports=function (sequelize,dataTypes){
    const task_comments=sequelize.define('task_comments',{
      comment:{
        type: dataTypes.STRING
      }
    },{
      freezeTableName:true
    })
    task_comments.associate=(models)=>{
        task_comments.belongsTo(models.users,{foreignKey:'commentor_id',constraints:false})
        task_comments.belongsTo(models.tasks,{foreignKey:'task_id',constraints:false})
    }
    return task_comments
  }