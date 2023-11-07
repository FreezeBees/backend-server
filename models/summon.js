'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Summon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  
    }
  }
  Summon.init({
    StudentId: DataTypes.STRING,
    BillId: DataTypes.STRING,
    dateSummonAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Summon',
  });
  return Summon;
};