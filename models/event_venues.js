module.exports=function (sequelize,dataTypes){
    const event_venues=sequelize.define('event_venues',{
      status:{
        type: dataTypes.STRING,
        allowNull: false
      }
    },{
      freezeTableName:true
    })
    event_venues.associate=(models)=>{
        event_venues.belongsTo(models.events,{foreignKey:'event_id'})
        event_venues.belongsTo(models.venues,{foreignKey:'venue_id'})
    }
    return event_venues
  }