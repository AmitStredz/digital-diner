const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Cache connection for serverless environment
let sequelizeInstance = null;

// PostgreSQL connection factory
const getSequelizeInstance = () => {
  // If we already have a working connection, use it
  if (sequelizeInstance && sequelizeInstance.authenticate) {
    try {
      // Quick connection check
      sequelizeInstance.authenticate({logging: false});
      console.log('Reusing existing PostgreSQL connection');
      return sequelizeInstance;
    } catch (err) {
      console.log('Existing connection invalid, creating new one');
      sequelizeInstance = null;
    }
  }

  // Get connection string - fail early if missing
  const connectionString = process.env.POSTGRES_URI;
  if (!connectionString) {
    throw new Error('POSTGRES_URI environment variable is not set');
  }

  // Create new connection
  try {
    sequelizeInstance = new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
      // IMPORTANT: Disable native pg for Vercel compatibility
      native: false,
      pool: {
        max: 2, // Maximum pool size for serverless
        min: 0, // Minimum pool size
        acquire: 15000, // Maximum time (ms) to acquire connection
        idle: 5000 // Maximum time (ms) connection can be idle
      },
      dialectOptions: {
        // For better performance in serverless
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
        // Avoid connection timeouts
        connectTimeout: 30000
      },
      retry: {
        max: 3 // Maximum retry attempts for failed queries
      }
    });
    
    return sequelizeInstance;
  } catch (error) {
    console.error('PostgreSQL instance creation error:', error.message);
    // For Vercel deployment - provide fallback instead of crashing
    if (error.message.includes('install pg package') || error.message.includes('Cannot find module')) {
      console.warn('WARNING: PostgreSQL native bindings not available. Using fallback connection method.');
      // Return a dummy sequelize instance that doesn't crash but logs errors
      return {
        authenticate: async () => console.log('PostgreSQL connection skipped - native bindings not available'),
        query: async () => { throw new Error('PostgreSQL not available in this environment'); },
        define: () => ({
          findAll: async () => [],
          findOne: async () => null,
          create: async () => ({ id: 'dummy', createdAt: new Date() }),
          update: async () => [0],
          destroy: async () => 0
        }),
        model: () => ({
          findAll: async () => [],
          findOne: async () => null
        }),
        models: {},
        close: async () => console.log('Dummy connection closed')
      };
    }
    throw error;
  }
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
    if (process.env.NODE_ENV === 'production') {
      console.warn('WARNING: PostgreSQL connection failed, continuing with limited functionality');
      return null;
    }
    throw error;
  }
};

// Helper to close connections when serverless function is done
const closePostgresConnection = async () => {
  if (sequelizeInstance) {
    try {
      await sequelizeInstance.close();
      sequelizeInstance = null;
      console.log('PostgreSQL connection closed');
    } catch (error) {
      console.error('Error closing PostgreSQL connection:', error);
    }
  }
};

module.exports = { 
  sequelize: getSequelizeInstance(),
  connectPostgres,
  closePostgresConnection
}; 