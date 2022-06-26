module.exports=function (sequelize,dataTypes){
    const users=sequelize.define('users',{
      email:{
        type: dataTypes.STRING,
        allowNull: false,
        unique:true
      },
      password:{
        type: dataTypes.STRING,
        allowNull:false
      },
      name:{
        type: dataTypes.STRING,
        allowNull:false
      },
      phone_number:{
        type: dataTypes.STRING,
        allowNull:false
      },
      user_role:{
        type: dataTypes.STRING
      },
      is_admin:{
          type:dataTypes.BOOLEAN,
          defaulValue:false
      },
      points: {
        type: dataTypes.INTEGER,
        defaultValue: 0
      },
      isThirdPartyAcc: {
        type:dataTypes.BOOLEAN,
        defaulValue: false
      },
      details: {
        type: dataTypes.JSON
      }
    },{
      freezeTableName:true
    })
    users.associate=(models)=>{
      users.belongsTo(models.companies,{foreignKey:'company_id',constraints:false})
    }
    return users
  }