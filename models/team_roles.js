module.exports=function (sequelize,dataTypes){
    const team_roles=sequelize.define('team_roles',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      }
    },{
      freezeTableName:true
    })
    return team_roles
  }