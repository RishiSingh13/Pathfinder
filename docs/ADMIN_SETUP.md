# Administrator Promotion Guide

To avoid deploying hardcoded passwords or insecure default credentials, this application implements a secure command-line promotion mechanism for administrators.

## How to Promote an Account to Administrator

1. **Sign up in the application:**
   Navigate to `/register` in your browser (e.g., `http://localhost:5173/register`) and create your personal account using your preferred email and password. All new registrations are assigned the `student` role by default for security.

2. **Promote the account using the CLI tool:**
   Run the following command from the workspace root, specifying the registered email:

   ```bash
   npm run make-admin -- your_email@example.com
   ```

   Or directly from the `server/` directory:

   ```bash
   node scripts/makeAdmin.js your_email@example.com
   ```

3. **Verify administrative access:**
   * Log out and log back in, or refresh your browser session.
   * You will see the **Admin** navigation link in the top navbar.
   * You can now access `/admin` to curate roadmaps, manage modules and topics, reorder curriculum, and resolve reported resource issues.
