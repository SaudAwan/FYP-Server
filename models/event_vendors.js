module.exports=function (sequelize,dataTypes){
    const event_vendors=sequelize.define('event_vendors',{
      status:{
          type: dataTypes.STRING
      }
    },{
      freezeTableName:true
    })
    event_vendors.associate=(models)=>{
        event_vendors.belongsTo(models.events,{foreignKey:'event_id'})
        event_vendors.belongsTo(models.vendors,{foreignKey:'vendor_id'})
    }
    return event_vendors
  }