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
      this.belongsTo(models.User);
    }
  }
  Summon.init({
    UserId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    remark: DataTypes.STRING,
    dateSummonAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Summon',
  });
  return Summon;
};