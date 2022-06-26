module.exports=function (sequelize,dataTypes){
    const event_assosciations=sequelize.define('event_assosciations',{
      
    },{
      freezeTableName:true
    })
    event_assosciations.associate=(models)=>{
        event_assosciations.belongsTo(models.events,{foreignKey:'event_id'})
        event_assosciations.belongsTo(models.assosciations,{foreignKey:'assosciations_id'})
    }
    return event_assosciations
  }