const Sequelize = require('sequelize')
const {dbName,dbUser,dbPassword,host}=process.env
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host,
  dialect: 'mysql'
})
module.exports=sequelize