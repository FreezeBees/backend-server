const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Role);
      this.hasMany(models.BookBorrow)
    }
  }
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    image: DataTypes.TEXT,
    reset_token: DataTypes.STRING,
    verifiedAt: DataTypes.DATE,
    RoleId: DataTypes.INTEGER,
    StudentId: DataTypes.STRING,
    residence: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
