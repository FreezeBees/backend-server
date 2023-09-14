'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookBorrow extends Model {
    static associate(models) {
      this.belongsTo(models.User);
      this.belongsTo(models.Book);
    }
  }
  BookBorrow.init({
    BookId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    dateBorrowAt: DataTypes.DATE,
    dateReturnAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'BookBorrow',
  });
  return BookBorrow;
};