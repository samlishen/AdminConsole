const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

const VM = sequelize.define('VM', {
    vmName: {
        type: Sequelize.STRING
    },
    ipAddress: {
        type: Sequelize.STRING
    }
});

VM.sync({force: false});

module.exports = VM;