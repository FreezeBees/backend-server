const bcrypt = require('bcrypt');
const faker = require('faker');
const helper = require('../helper');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'miyoi',
      email: 'miyoi@example.com',
      phone: '+601111111111',
      password: bcrypt.hashSync('030203050137', bcrypt.genSaltSync()),
      RoleId: 1,
      image: helper.getRandomImage(),
      verifiedAt: faker.date.past(2),
      StudentId: 'SET21070268',
      residence: 'Home',
    },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
