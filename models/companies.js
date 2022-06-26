module.exports=function (sequelize,dataTypes){
    const companies=sequelize.define('companies',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      }
    },{
      freezeTableName:true
    })
    // companies.associate=(models)=>{
    //   models.users.hasOne(companies,{foreignKey:'created_by',constraints:false})
    // }
    return companies
  }