const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './notes.db',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the SQLite database:', error);
  }
})();

module.exports = sequelize;
