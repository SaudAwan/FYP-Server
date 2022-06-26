module.exports=function (sequelize,dataTypes){
    const agenda_sessions=sequelize.define('agenda_sessions',{
      timing:{
        type: dataTypes.STRING
      },
      session_name:{
        type: dataTypes.STRING,
      }
    },{
      freezeTableName:true
    })
    agenda_sessions.associate=(models)=>{
        agenda_sessions.belongsTo(models.speakers,{foreignKey:'speaker_id',constraints:false})
        agenda_sessions.belongsTo(models.agenda_session_days,{foreignKey:'session_day_id',constraints:false})
        agenda_sessions.belongsTo(models.agendas,{foreignKey:'agenda_id',constraints:false})
    }
    return agenda_sessions
  }