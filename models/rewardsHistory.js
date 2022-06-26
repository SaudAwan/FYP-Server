module.exports=function (sequelize,dataTypes){
    const rewardsHistory=sequelize.define('rewards_history',{
      reward_id:{
        type: dataTypes.BIGINT,
        allowNull: false
      },
      user_id: {
        type: dataTypes.BIGINT,
        allowNull: false,
      },
      received: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
      },
    },{
      freezeTableName:true
    })
    rewardsHistory.associate=(models)=>{
        rewardsHistory.belongsTo(models.users,{foreignKey:'user_id',constraints:false})
        rewardsHistory.belongsTo(models.rewards,{foreignKey:'reward_id',constraints:false, as: 'reward'})
    }
    return rewardsHistory
  }