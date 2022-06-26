module.exports=function (sequelize,dataTypes){
    const agenda_session_days=sequelize.define('agenda_session_days',{
      session_day:{
        type: dataTypes.STRING
      }
    },{
      freezeTableName:true
    })
    agenda_session_days.associate=(models)=>{
        agenda_session_days.belongsTo(models.agendas,{foreignKey:'agenda_id',constraints:false})
    }
    return agenda_session_days
  }