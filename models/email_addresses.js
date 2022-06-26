module.exports=function (sequelize,dataTypes){
    const email_addresses = sequelize.define('email_addresses',{
      address: {
        type: dataTypes.STRING,
        allowNull: false,
        isEmail: true,
        unique: true,
      },
    },{
      freezeTableName:true,
    })
    return email_addresses
  }