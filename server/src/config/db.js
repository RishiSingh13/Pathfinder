const mongoose = require('mongoose');
const env = require('./env');

let memoryServer = null;

async function connectDB(customUri) {
  const uri = customUri || env.MONGODB_URI;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to MongoDB at ${uri}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB (${uri}): ${err.message}`);
    
    if (env.USE_IN_MEMORY_DB_IF_LOCAL_FAILS && env.NODE_ENV !== 'production') {
      console.log('[Database] Starting in-memory MongoDB fallback for local development...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        await mongoose.connect(memUri);
        console.log(`[Database] Connected to in-memory MongoDB at ${memUri}`);
      } catch (fallbackErr) {
        console.error('[Database] Failed to start in-memory MongoDB:', fallbackErr);
        throw fallbackErr;
      }
    } else {
      throw err;
    }
  }
}

async function closeDB() {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
    console.log('[Database] Connection closed successfully');
  } catch (err) {
    console.error('[Database] Error closing DB connection:', err);
  }
}

module.exports = { connectDB, closeDB };
