# Sentry Setup Guide

This guide will walk you through setting up Sentry for error reporting and user feedback in the application.

## 1. Create a Sentry Account
1. Go to [sentry.io](https://sentry.io/) and sign up for an account.
2. Follow the onboarding to create a new Organization.
3. Create a new **Project** for your application (select your framework, e.g., Next.js).

## 2. Get Your DSN
1. Once the project is created, Sentry will provide a **DSN (Data Source Name)**.
2. It looks something like: `https://examplePublicKey@o0.ingest.sentry.io/0`.
3. Add this DSN to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
   ```

## 3. Install Sentry SDK
Run the following command to install Sentry and configure it automatically in a Next.js app:
```bash
npx @sentry/wizard@latest -i nextjs
```
*This wizard will configure your `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and update your `next.config.js`.*

## 4. Enable User Feedback (Optional but Recommended)
To capture user feedback when an error occurs:
1. Sentry's default error page usually captures feedback out of the box if configured.
2. In your Sentry Dashboard, navigate to **Settings > Projects > [Your Project] > User Feedback**.
3. Enable the Crash-Report Modal or the Feedback Widget to get deeper insights from your users.

## 5. Verify Setup
1. Trigger a test error in your app (e.g., `throw new Error("Sentry Test Error");`).
2. Check your Sentry dashboard under the **Issues** tab to see the captured error.
