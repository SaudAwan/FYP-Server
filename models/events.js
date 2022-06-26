module.exports=function (sequelize,dataTypes){
    const events=sequelize.define('events',{
      name:{
        type: dataTypes.STRING,
        allowNull: false
      },
      eventKey: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      start_date:{
        type: dataTypes.DATEONLY,
      },
      end_date:{
        type: dataTypes.DATEONLY,
      },
      location:{
        type: dataTypes.STRING,
      },
      target_revenue:{
        type: dataTypes.INTEGER,
      },
      sponsorship:{
        type: dataTypes.INTEGER,
      },
      delegate_sales:{
        type: dataTypes.INTEGER,
      },
      marketing:{
        type: dataTypes.INTEGER,
      }
    },{
      freezeTableName:true
    })
    events.associate=(models)=>{
        events.belongsTo(models.companies,{foreignKey:'company_id',constraints:false})
        events.belongsTo(models.teams,{foreignKey:'team_id',constraints:false})
        events.belongsTo(models.event_categories,{foreignKey:'category_id',constraints:false})
    }
    return events
  }