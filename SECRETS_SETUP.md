# Required Secrets & Keys

To make the application fully functional (especially Login), you need to set up the following environment variables in your `.env` file. Refere to `.env.example`.

## 1. NextAuth Secret (`AUTH_SECRET`)
Used to encrypt session tokens.
- **How to get**: Run this command in your terminal:
  ```bash
  npx auth secret
  ```
  Copy the output and paste it as `AUTH_SECRET=...` in `.env`.

## 2. GitHub OAuth Keys (`GITHUB_ID`, `GITHUB_SECRET`)
Required for "Login with GitHub".
- **How to get**:
  1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
  2. Click **"New OAuth App"**.
  3. Fill in the form:
     - **Application Name**: `My SaaS Portfolio`
     - **Homepage URL**: `http://localhost:3000`
     - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
  4. Click **Register application**.
  5. Copy **Client ID** -> `GITHUB_ID`.
  6. Generate a **Client Secret** -> `GITHUB_SECRET`.

## 3. Database (`DATABASE_URL`)
- Currently set to `"file:./dev.db"` for SQLite. No action needed unless deploying to production (e.g., Vercel Postgres).

---

## Future Keys (For SaaS Features)
If you proceed to implement the **Deployment** features for other users:
1. **Vercel API Token**: To deploy sites to Vercel programmatically.
2. **GitHub Personal Access Token**: To create repos for users.
