module.exports=function (sequelize,dataTypes){
    const event_categories=sequelize.define('event_categories',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      },
      description:{
        type: dataTypes.STRING,
      }
    },{
      freezeTableName:true
    })
    return event_categories
  }