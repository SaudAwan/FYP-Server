module.exports=function (sequelize,dataTypes){
    const event_inventory=sequelize.define('event_inventory',{
      item:{
        type: dataTypes.STRING,
        allowNull: false
      },
      quantity:{
        type: dataTypes.STRING,
      },
      status:{
        type: dataTypes.STRING,
      },
      location:{
        type: dataTypes.STRING,
      }
    },{
      freezeTableName:true
    })
    event_inventory.associate=(models)=>{
        event_inventory.belongsTo(models.companies,{foreignKey:'company_id'})
        event_inventory.belongsTo(models.events,{foreignKey:'event_id'})
    }
    return event_inventory
  }