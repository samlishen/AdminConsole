const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

const Restaurant = sequelize.define('Restaurant', {
    restaruantName: {
        type: Sequelize.STRING
    }
});

Restaurant.sync({force: false});

module.exports = Restaurant;