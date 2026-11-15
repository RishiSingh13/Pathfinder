const { connectDB, closeDB } = require('../src/config/db');
const { seedDatabase } = require('./seed');

async function run() {
  try {
    await connectDB();
    await seedDatabase();
    console.log('[SeedRunner] Finished successfully.');
  } catch (err) {
    console.error('[SeedRunner] Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

if (require.main === module) {
  run();
}

module.exports = run;
