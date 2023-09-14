module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.addColumn('Users', 'StudentId', {
      type: Sequelize.STRING,
    }, { transaction: t }),
  ])),
  down: (queryInterface) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.removeColumn('Users', 'StudentId', { transaction: t }),
  ])),
};
