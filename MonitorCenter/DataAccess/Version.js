const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

const Version = sequelize.define('Version', {
    commitHash: {
        type: Sequelize.STRING
    },
    commitMessage: {
        type: Sequelize.STRING
    }
});

Version.sync({force: false});

module.exports = Version;