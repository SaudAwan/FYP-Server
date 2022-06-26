module.exports=function (sequelize,dataTypes){
    const event_delegates=sequelize.define('event_delegates',{
    },{
      freezeTableName:true
    })
    event_delegates.associate=(models)=>{
        event_delegates.belongsTo(models.events,{foreignKey:'event_id'})
        event_delegates.belongsTo(models.event_categories,{foreignKey:'category_id'})
        event_delegates.belongsTo(models.delegates,{foreignKey:'delegate_id'})
    }
    return event_delegates
  }