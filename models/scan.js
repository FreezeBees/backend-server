'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Scan.init({
    name: DataTypes.STRING,
    StudentId: DataTypes.STRING,
    residence: DataTypes.STRING,
    scannedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Scan',
  });
  return Scan;
};