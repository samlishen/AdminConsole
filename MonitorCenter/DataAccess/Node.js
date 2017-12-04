const Sequelize = require('sequelize');

const sequelize = require('./sequelize');
const VM = require('./VM');
const Restaurant = require('./Restaurant');
const Version = require('./Version');

const Node = sequelize.define('Node', {
    port: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    pid: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    }
});

Node.belongsTo(Restaurant);
Restaurant.hasMany(Node);
Node.belongsTo(VM);
VM.hasMany(Node);
Node.belongsTo(Version);
Version.hasMany(Node);


Node.sync({force: false});

module.exports = Node;