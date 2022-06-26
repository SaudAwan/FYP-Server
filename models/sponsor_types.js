module.exports=function (sequelize,dataTypes){
    const sponsor_types=sequelize.define('sponsor_types',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      }
    },{
      freezeTableName:true
    })
    sponsor_types.associate=(models)=>{
        sponsor_types.belongsTo(models.companies,{foreignKey:'company_id'})
    }
    return sponsor_types
  }