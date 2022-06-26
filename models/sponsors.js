module.exports=function (sequelize,dataTypes){
    const sponsors=sequelize.define('sponsors',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      },
      designation:{
        type: dataTypes.BOOLEAN,
        allowNull:false
      },
      contact_number:{
        type: dataTypes.STRING,
        allowNull:false
      }
    },{
      freezeTableName:true
    })
    sponsors.associate=(models)=>{
        sponsors.belongsTo(models.companies,{foreignKey:'company_id'})
    }
    return sponsors
  }