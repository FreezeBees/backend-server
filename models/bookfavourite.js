'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookFavourite extends Model {
    static associate(models) {
      this.belongsTo(models.User);
      this.belongsTo(models.Book);
    }
  }
  BookFavourite.init({
    BookId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'BookFavourite',
  });
  return BookFavourite;
};