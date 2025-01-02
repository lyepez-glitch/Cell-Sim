const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Reference the User model

const Nanobot = sequelize.define('Nanobot', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'idle', // Default status
    },
}, {
    timestamps: true,
});

// Relationship: A User can have many Nanobots
Nanobot.belongsTo(User, { foreignKey: 'userId' });

module.exports = Nanobot;