const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// PostgreSQL connection
const sequelize = new Sequelize(
  process.env.POSTGRES_URI || 'postgresql://postgres:[YOUR-PASSWORD]@db.iaynguqaltrwighlrlsm.supabase.co:5432/postgres',
  {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectPostgres }; 