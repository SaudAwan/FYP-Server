module.exports=function (sequelize,dataTypes){
    const event_tickets=sequelize.define('event_tickets',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      },
      contact_number:{
        type: dataTypes.STRING,
      },
      flight_status:{
        type: dataTypes.STRING,
      },
      accomodation:{
        type: dataTypes.STRING,
      }
    },{
      freezeTableName:true
    })
    event_tickets.associate=(models)=>{
        event_tickets.belongsTo(models.companies,{foreignKey:'company_id'})
    }
    return event_tickets
  }