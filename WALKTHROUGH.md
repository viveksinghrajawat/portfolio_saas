# SaaS Platform Walkthrough

## Overview
A complete SaaS platform built with **Next.js 14**, **Tailwind CSS**, **NextAuth.js**, and **Prisma**.
Users can create portfolios from templates or upload custom HTML, and deploy them to GitHub Pages.

## Features

### 1. Home Page / Portfolio
- **Hero**: Animated intro with "Lead Gen" CTA.
- **Sections**: Tech Stack, Projects, Contact Form (functional mock), Booking UI.
- **Responsiveness**: Fully mobile-optimized.

### 2. Authentication
- **Login**: GitHub OAuth integration.
- **Protection**: Middleware protects `/dashboard` and `/admin` routes.

### 3. Dashboard (`/dashboard`)
- **New Project**: Choose between "Template" or "Upload HTML".
- **Templates**: Browse and select from pre-defined templates.
- **Upload**: Paste or upload raw HTML.

### 4. Template Editor (`/editor/[id]`)
- **Real-time Preview**: Edit form fields and see changes instantly.
- **Deployment**: One-click deploy to GitHub (creates repo + pages).

### 5. Admin Dashboard (`/admin`)
- **Analytics**: Visualization of visitor stats (currently using mock data for stability).
- **Charts**: Built with Recharts.

## Deployment Guide (Vercel)

To deploy this platform itself to Vercel:

1.  **Push to GitHub**: Push this entire project to a new GitHub repository.
2.  **Import to Vercel**: Go to Vercel Dashboard -> Add New Project -> Import from GitHub.
3.  **Environment Variables**: Add the following in Vercel Settings:
    - `AUTH_SECRET`: (Generate with `npx auth secret`)
    - `GITHUB_ID`: From your GitHub OAuth App.
    - `GITHUB_SECRET`: From your GitHub OAuth App.
    - `DATABASE_URL`: Your Postgres connection string (e.g. Vercel Postgres).
4.  **Build Command**: Default (`next build`)
5.  **Install Command**: Default (`npm install`)
6.  **Deploy**: Click Deploy!

## Verification
- [x] **Home Page**: Check animations and Contact Form toast.
- [x] **Login**: Verify redirection to Dashboard.
- [x] **Editor**: Verify preview updates on typing.
- [x] **Deploy API**: Verify Zod validation blocks empty requests.
