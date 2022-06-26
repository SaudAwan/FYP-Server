module.exports=function (sequelize,dataTypes){
    const event_media_partners=sequelize.define('event_media_partners',{
    },{
      freezeTableName:true
    })
    event_media_partners.associate=(models)=>{
        event_media_partners.belongsTo(models.events,{foreignKey:'event_id'})
        event_media_partners.belongsTo(models.partners,{foreignKey:'partner_id'})
    }
    return event_media_partners
  }