// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the sequelize instance

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // other fields
});

module.exports = User;