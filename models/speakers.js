module.exports=function (sequelize,dataTypes){
    const speakers=sequelize.define('speakers',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      },
      contact_number:{
        type: dataTypes.STRING,
        allowNull: false
      },
      designation:{
        type: dataTypes.STRING,
        allowNull: false
      },
      email:{
        type: dataTypes.STRING,
        allowNull: false
      },
      speaker_company:{
        type: dataTypes.STRING,
      },
      status:{
        type: dataTypes.STRING,
        allowNull: false
      },
      enable_travel_and_stay:{
        type: dataTypes.BOOLEAN
      },
      boarding_point:{
        type:dataTypes.STRING
      },
      destination:{
        type:dataTypes.STRING,
      },
      travel_start_date:{
        type:dataTypes.DATEONLY
      },
      travel_end_date:{
        type:dataTypes.DATEONLY
      },
      stay_start_date:{
        type:dataTypes.DATEONLY
      },
      stay_end_date:{
        type:dataTypes.DATEONLY
      }
    },{
      freezeTableName:true
    })
    speakers.associate=(models)=>{
        speakers.belongsTo(models.companies,{foreignKey:'company_id',constraints:false})
        speakers.belongsTo(models.events,{foreignKey:'event_id',constraints:false})
    }
    return speakers
  }