const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Nanobot = require('./Nanobot'); // Reference the Nanobot model

const Simulation = sequelize.define('Simulation', {
    simulationName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // Default status
    },
    results: {
        type: DataTypes.JSON, // JSON type to store simulation results
        allowNull: true,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Relationships:
// A Simulation belongs to a User (the initiator)
Simulation.belongsTo(User, { foreignKey: 'userId' });
// A Simulation uses a Nanobot
Simulation.belongsTo(Nanobot, { foreignKey: 'nanobotId' });

module.exports = Simulation;