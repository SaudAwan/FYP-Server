module.exports=function (sequelize,dataTypes){
    const partners=sequelize.define('partners',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      },
      partner_company:{
        type: dataTypes.STRING
      },
      email:{
        type: dataTypes.STRING
      },
      contact_number:{
        type: dataTypes.STRING
      }
    },{
      freezeTableName:true
    })
    partners.associate=(models)=>{
        partners.belongsTo(models.companies,{foreignKey:'company_id'})
        partners.belongsTo(models.events,{foreignKey:'event_id'})
    }
    return partners
  }