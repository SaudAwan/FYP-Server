module.exports=function (sequelize,dataTypes){
    const delegate_categories=sequelize.define('delegate_categories',{
      name:{
          type: dataTypes.STRING,
          allowNull: false
      },
      description:{
          type: dataTypes.STRING
      }
    },{
      freezeTableName:true
    })
    return delegate_categories
  }