module.exports=function (sequelize,dataTypes){
    const teams=sequelize.define('teams',{
      name:{
        type: dataTypes.STRING
      }
    },{
      freezeTableName:true
    })
    teams.associate=(models)=>{
        teams.belongsTo(models.users,{foreignKey:'created_by',constraints:false})
        teams.belongsTo(models.events,{foreignKey:'event_id',constraints:false})
        teams.belongsTo(models.companies,{foreignKey:'company_id',constraints:false})
    }
    return teams
  }