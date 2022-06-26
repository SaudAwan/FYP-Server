module.exports=function (sequelize,dataTypes){
    const company_users=sequelize.define('company_users',{
      
    },{
      freezeTableName:true
    })
    company_users.associate=(models)=>{
      company_users.belongsTo(models.users,{foreignKey:'employee_id',constraints:false}),
      company_users.belongsTo(models.companies,{foreignKey:'company_id',constraints:false})
    }
    return company_users
  }