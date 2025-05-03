const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Cache connection for serverless environment
let sequelizeInstance = null;

// PostgreSQL connection factory
const getSequelizeInstance = () => {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  // Create new connection
  sequelizeInstance = new Sequelize(
    process.env.POSTGRES_URI || 'postgresql://postgres:[YOUR-PASSWORD]@db.iaynguqaltrwighlrlsm.supabase.co:5432/postgres',
    {
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        // For better performance in serverless
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
        // Avoid connection timeouts
        connectTimeout: 60000
      }
    }
  );

  return sequelizeInstance;
};

const connectPostgres = async () => {
  try {
    const sequelize = getSequelizeInstance();
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
    return sequelize;
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    // Don't exit process in serverless
    throw error;
  }
};

module.exports = { 
  sequelize: getSequelizeInstance(),
  connectPostgres
}; 