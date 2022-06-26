module.exports=function (sequelize,dataTypes){
    const event_sponsors=sequelize.define('event_sponsors',{
      
    },{
      freezeTableName:true
    })
    event_sponsors.associate=(models)=>{
        event_sponsors.belongsTo(models.events,{foreignKey:'event_id'})
        event_sponsors.belongsTo(models.sponsors,{foreignKey:'sponsor_id'})
        event_sponsors.belongsTo(models.sponsor_types,{foreignKey:'type'})
    }
    return event_sponsors
  }