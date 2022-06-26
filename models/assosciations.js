module.exports=function (sequelize,dataTypes){
    const assosciations=sequelize.define('assosciations',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      },
      association_company:{
        type: dataTypes.STRING,
        allowNull: false
      },
      email:{
        type: dataTypes.STRING,
      },
      contact_number:{
        type: dataTypes.STRING,
      }
    },{
      freezeTableName:true
    })
    assosciations.associate=(models)=>{
        assosciations.belongsTo(models.companies,{foreignKey:'company_id'})
    }
    return assosciations
  }