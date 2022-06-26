module.exports=function (sequelize,dataTypes){
    const venues=sequelize.define('venues',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
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
    venues.associate=(models)=>{
        venues.belongsTo(models.companies,{foreignKey:'company_id'})
    }
    return venues
  }