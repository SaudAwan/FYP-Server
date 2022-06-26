module.exports=function (sequelize,dataTypes){
    const vendors=sequelize.define('vendors',{
      name:{
          type: dataTypes.STRING,
          allowNull: false
      },
      contact_number:{
          type: dataTypes.STRING
      }
    },{
      freezeTableName:true
    })
    vendors.associate=(models)=>{
        vendors.belongsTo(models.companies,{foreignKey:'company_id'})
    }
    return vendors
  }