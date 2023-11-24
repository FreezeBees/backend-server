module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.removeColumn('BookBorrows', 'UserId', { transaction: t }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(t => Promise.all([
    queryInterface.addColumn('BookBorrows', 'UserId', {
      type: Sequelize.INTEGER,
    }, { transaction: t }),
  ])),
};
