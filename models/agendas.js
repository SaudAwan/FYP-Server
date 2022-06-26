module.exports=function (sequelize,dataTypes){
    const agendas=sequelize.define('agendas',{
      title:{
        type: dataTypes.STRING
      },
      status:{
        type: dataTypes.STRING
      }
    },{
      freezeTableName:true
    })
    agendas.associate=(models)=>{
        agendas.belongsTo(models.companies,{foreignKey:'company_id',constraints:false})
        agendas.belongsTo(models.events,{foreignKey:'event_id',constraints:false})
        agendas.belongsTo(models.users,{foreignKey:'created_by',constraints:false})

    }
    return agendas
  }