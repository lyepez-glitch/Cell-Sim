'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Simulation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Simulation.init({
    simulationName: DataTypes.STRING,
    status: DataTypes.STRING,
    results: DataTypes.TEXT,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    nanobotId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Simulation',
  });
  return Simulation;
};