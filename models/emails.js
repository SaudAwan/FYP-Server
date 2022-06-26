module.exports=function (sequelize,dataTypes){
    const emails = sequelize.define('emails',{
      content:{
        type: dataTypes.JSON,
        allowNull: false
      },
      recipients: {
        type: dataTypes.JSON,
        allowNull: false
      }
    },{
      freezeTableName:true,
      defaultScope: {order: [['createdAt', 'DESC']]},
    })
    return emails
  }