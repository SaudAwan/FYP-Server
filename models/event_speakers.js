module.exports=function (sequelize,dataTypes){
    const event_speakers=sequelize.define('event_speakers',{
      status:{
        type: dataTypes.STRING,
        allowNull: false
      }
    },{
      freezeTableName:true
    })
    event_speakers.associate=(models)=>{
        event_speakers.belongsTo(models.events,{foreignKey:'event_id'})
        event_speakers.belongsTo(models.speakers,{foreignKey:'speaker_id'})
    }
    return event_speakers
  }