const Sequelize = require('sequelize')
const config = require('./MySqlConfig')

const sequelize = module.exports = new Sequelize(
    config.instance,
    config.username,
    config.password,
    {
        dialect: 'mysql',
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamp: true
        },
        host: config.host,
        port: config.port,
        pool: {
            max: config.pool.max,
            min: config.pool.min
        }
    });