/**
 * CLI Utility to promote a registered user to Administrator.
 * Usage:
 *   node server/scripts/makeAdmin.js <email>
 *   or from root: npm run make-admin -- <email>
 */

const { connectDB, closeDB } = require('../src/config/db');
const User = require('../src/models/User');

async function makeAdmin(targetEmail) {
  if (!targetEmail) {
    console.error('Error: Please provide the email address of the user to promote.');
    console.error('Usage: npm run make-admin -- user@example.com');
    process.exit(1);
  }

  const normalizedEmail = targetEmail.trim().toLowerCase();

  try {
    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.error(`Error: No registered user found with email "${normalizedEmail}".`);
      console.log('Please register the account first in the application, then run this command.');
      process.exitCode = 1;
      return;
    }

    if (user.role === 'admin') {
      console.log(`User "${user.displayName}" (${user.email}) is already an Administrator.`);
      return;
    }

    user.role = 'admin';
    await user.save();

    console.log(`\n======================================================`);
    console.log(`SUCCESS: User "${user.displayName}" (${user.email})`);
    console.log(`has been promoted to Administrator.`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error('Failed to promote user to admin:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

const emailArg = process.argv[2];
if (require.main === module) {
  makeAdmin(emailArg);
}

module.exports = makeAdmin;
