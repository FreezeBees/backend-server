'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Enforce uniqueness for book names
        validate: {
          // Use a custom validator to check for special characters
          noSpecialChars(value) {
            const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
            if (specialCharacterRegex.test(value)) {
              throw new Error('Book name contains special characters');
            }
          },
        },
      },
      status: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Books');
  }
};
