# Deployment Verification Plan

## Goal Description
Verify that the project is ready for deployment to Vercel (frontend) and Supabase (database).

## User Review Required
> [!IMPORTANT]
> - **Environment Variables**: The user needs to provide the actual values for `DATABASE_URL` (Supabase), `AUTH_SECRET`, `GITHUB_ID`, and `GITHUB_SECRET`.

## Remediation Plan (Executed)

### 1. Fix NextAuth
- [x] Uninstall `next-auth` v4.
- [x] Install `next-auth@beta` (v5).

### 2. Fix Database Config
- [x] Updated `schema.prisma` to `postgresql`.
- [x] Added `DATABASE_URL` placeholder in `.env`.

### 3. Fix Lint Errors
- [x] Fixed unescaped quotes in `app/page.jsx`.

## Next Steps
1. User must fill `DATABASE_URL` in `.env`.
2. Run `npx prisma db push` to sync schema to Supabase.
3. Run `npm run build` to verify final build.
