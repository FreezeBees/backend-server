'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model { 
    static associate(models) {
      this.hasMany(models.BookBorrow);
      this.hasMany(models.BookFavourite);
    }
  }
  Book.init({
    name: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};