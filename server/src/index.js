const app = require('./app');
const env = require('./config/env');
const { connectDB, closeDB } = require('./config/db');
const Roadmap = require('./models/Roadmap');
const { seedDatabase } = require('../seeds/seed');

async function startServer() {
  try {
    await connectDB();

    if ((await Roadmap.countDocuments()) === 0) {
      await seedDatabase();
    }

    const server = app.listen(env.PORT, () => {
      console.log(`[Server] REST API listening on port ${env.PORT} (${env.NODE_ENV})`);
      console.log(`[Server] Health check available at http://localhost:${env.PORT}/api/v1/health`);
    });

    const shutdown = async () => {
      console.log('\n[Server] Graceful shutdown initiated...');
      server.close(async () => {
        await closeDB();
        console.log('[Server] Shutdown complete.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
