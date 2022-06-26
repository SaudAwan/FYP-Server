module.exports=function (sequelize,dataTypes){
    const rewards=sequelize.define('rewards',{
      title:{
        type: dataTypes.STRING,
        allowNull: false
      },
      color: {
        type: dataTypes.STRING,
        allowNull: false,
      }
    },{
      freezeTableName:true
    })
    return rewards
  }