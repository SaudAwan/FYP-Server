module.exports=function (sequelize,dataTypes){
    const delegates=sequelize.define('delegates',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      },
      delegate_company:{
        type: dataTypes.STRING,
        allowNull: false
      },
      contact_number:{
        type: dataTypes.STRING,
      },
      designation:{
        type: dataTypes.STRING,
      }
    },{
      freezeTableName:true
    })
    delegates.associate=(models)=>{
        delegates.belongsTo(models.companies,{foreignKey:'company_id'})
    }
    return delegates
  }