const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const pg = require('pg');

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
    } catch (error) {
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
    // sequelizeInstance = new Sequelize(connectionString, {
    //   dialect: 'postgres',
    //   logging: false,
    //   // IMPORTANT: Disable native pg for Vercel compatibility
    //   native: false,
    //   pool: {
    //     max: 2, // Maximum pool size for serverless
    //     min: 0, // Minimum pool size
    //     acquire: 15000, // Maximum time (ms) to acquire connection
    //     idle: 5000 // Maximum time (ms) connection can be idle
    //   },
    //   dialectOptions: {
    //     // For better performance in serverless
    //     ssl: {
    //       require: true,
    //       rejectUnauthorized: false
    //     },
    //     // Avoid connection timeouts
    //     connectTimeout: 30000
    //   },
    //   retry: {
    //     max: 3 // Maximum retry attempts for failed queries
    //   }
    // });
    sequelizeInstance = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectModule: pg
    });
    
    return sequelizeInstance;
  } catch (error) {
    console.error('PostgreSQL instance creation error:', error.message);
    // For Vercel deployment - provide fallback instead of crashing
    if (error.message.includes('install pg package') || error.message.includes('Cannot find module')) {
      console.warn('WARNING: PostgreSQL native bindings not available. Using fallback connection method.');
      
      // Create a mock sequelize instance with all necessary methods for model definitions
      const mockSequelize = {
        authenticate: async () => console.log('PostgreSQL connection skipped - native bindings not available'),
        query: async () => { throw new Error('PostgreSQL not available in this environment'); },
        define: (modelName, attributes, options) => {
          console.log(`Mock model defined: ${modelName}`);
          // Create a mock model with all necessary methods
          const mockModel = {
            findAll: async () => [],
            findOne: async () => null,
            create: async () => ({ id: 'dummy', createdAt: new Date() }),
            update: async () => [0],
            destroy: async () => 0,
            // Add relationship methods
            belongsTo: () => mockModel,
            hasMany: () => mockModel,
            hasOne: () => mockModel,
            belongsToMany: () => mockModel,
            // Add other necessary methods
            sync: async () => mockModel,
            count: async () => 0,
            findByPk: async () => null
          };
          return mockModel;
        },
        model: () => ({
          findAll: async () => [],
          findOne: async () => null,
          // Add relationship methods
          belongsTo: () => {},
          hasMany: () => {},
          hasOne: () => {},
          belongsToMany: () => {}
        }),
        models: {},
        close: async () => console.log('Dummy connection closed'),
        sync: async () => console.log('Mock sync performed'),
        // DataTypes mock for model definitions
        DataTypes: {
          STRING: 'STRING',
          TEXT: 'TEXT',
          INTEGER: 'INTEGER',
          FLOAT: 'FLOAT',
          BOOLEAN: 'BOOLEAN',
          DATE: 'DATE',
          DATEONLY: 'DATEONLY',
          DECIMAL: () => 'DECIMAL',
          UUID: 'UUID',
          UUIDV4: 'UUIDV4',
          ENUM: () => 'ENUM',
          JSON: 'JSON',
          VIRTUAL: 'VIRTUAL'
        }
      };
      
      return mockSequelize;
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