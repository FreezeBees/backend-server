const bcrypt = require('bcrypt');
const faker = require('faker');
const helper = require('../helper');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'fareez',
      email: 'fareezais03@gmail.com',
      phone: '+601111111111',
      password: bcrypt.hashSync('fareez', bcrypt.genSaltSync()),
      RoleId: 2,
      image: helper.getRandomImage(),
      verifiedAt: faker.date.past(2),
      StudentId: 'SET21070711',
      residence: 'Hostel',
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
