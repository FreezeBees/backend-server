module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.addColumn('Books', 'image', {
      type: Sequelize.STRING,
    }, { transaction: t }),
  ])),
  down: (queryInterface) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.removeColumn('Books', 'image', { transaction: t }),
  ])),
};
