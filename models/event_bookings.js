module.exports=function (sequelize,dataTypes){
    const eventsBookings=sequelize.define('event_bookings',{
      name: {
        type: dataTypes.STRING(255),
        allowNull: false
      },
      email: {
        type: dataTypes.STRING(255),
        allowNull: true,
        isEmail: true,
      },
      phone: {
        type: dataTypes.STRING,
        allowNull: false
      },
      gender: {
        type: dataTypes.ENUM,
        values: ['male', 'female', 'other'],
        allowNull: false
      }
    },{
      freezeTableName:true
    })
    eventsBookings.associate=(models)=>{
        eventsBookings.belongsTo(models.event_categories,{foreignKey:'event_id',constraints:false})
    }
    return eventsBookings
  }