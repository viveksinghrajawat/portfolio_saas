# Free Deployment Gameplan 🚀

You can host this entire SaaS platform for **$0/month** using the following stack:

## 1. The Stack
- **Frontend/API**: [Vercel](https://vercel.com) (Hobby Tier - Free forever for non-commercial/personal use)
- **Database**: [Supabase](https://supabase.com) (Free Tier - 500MB storage, sufficient for thousands of users)
- **Repo Hosting**: GitHub (Free)

## 2. Step-by-Step Deployment Guide

### Step A: Setup Supabase (Database)
1. Go to [Supabase.com](https://supabase.com) and sign up/login.
2. Click **"New Project"**.
3. Create a new organization (if needed) and name your project (e.g., `my-saas-portfolio`).
4. **IMPORTANT**: Copy the **database password** you set. You won't see it again.
5. Wait for the database to provision (takes ~1 min).
6. Go to **Project Settings** -> **Database**.
7. Under "Connection string", select **"URI"** and copy the string.
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.Ref.supabase.co:5432/postgres`
   - **Tip**: Use the **Transaction Pooler** (port 6543) if deploying to Vercel Serverless to avoid connection limits.

### Step B: Push Code to GitHub
1. Create a new repository on GitHub (e.g., `saas-portfolio-v1`).
2. Run these commands in your VS Code terminal:
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git branch -M main
   git remote add origin https://github.com/[YOUR_USERNAME]/saas-portfolio-v1.git
   git push -u origin main
   ```

### Step C: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Select the `saas-portfolio-v1` repo you just pushed.
4. In the **"Configure Project"** screen:
   - Expand **"Environment Variables"**.
   - Add the following (from your `SECRETS.md` + Supabase):
     - `DATABASE_URL`: Paste the Supabase URI from Step A.
     - `AUTH_SECRET`: Your generated secret.
     - `GITHUB_ID`: Your GitHub OAuth Client ID.
     - `GITHUB_SECRET`: Your GitHub OAuth Client Secret.
5. Click **"Deploy"**.

### Step D: Initialize Database
Once Vercel finishes building (or locally if you update your `.env`):
1. You need to push the schema to Supabase.
2. Since you can't run terminal commands on Vercel easily, run this **LOCALLY** (make sure your local `.env` has the Supabase `DATABASE_URL`):
   ```bash
   npx prisma db push
   ```
   *This will connect to the remote Supabase DB and create the tables.*

## 3. Verification
- Visit your Vercel URL (e.g., `https://saas-portfolio-v1.vercel.app`).
- Try logging in (ensure your GitHub OAuth App "Authorization callback URL" is updated to `https://[YOUR-VERCEL-URL]/api/auth/callback/github`).
- Check `/admin` to see if analytics are tracking (requires un-mocking the analytics code, see below).

---
> **Note**: To enable real analytics, verify `lib/analytics.js` interacts with Prisma/DB and not the mock data we added earlier.
