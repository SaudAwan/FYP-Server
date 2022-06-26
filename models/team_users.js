module.exports=function (sequelize){
    const team_users=sequelize.define('team_users',{
     
    },{
      freezeTableName:true
    })
    team_users.associate=(models)=>{
        team_users.belongsTo(models.teams,{foreignKey:'team_id',constraints:false})
        team_users.belongsTo(models.team_roles,{foreignKey:'team_role_id',constraints:false})
        team_users.belongsTo(models.users,{foreignKey:'user_id',constraints:false})
    }
    return team_users
  }