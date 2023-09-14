const bcrypt = require('bcrypt');
const faker = require('faker');
const helper = require('../helper');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: 'qila',
      email: 'qila@example.com',
      phone: '+601111111111',
      password: bcrypt.hashSync('030515040368', bcrypt.genSaltSync()),
      RoleId: 1,
      image: helper.getRandomImage(),
      verifiedAt: faker.date.past(2),
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
