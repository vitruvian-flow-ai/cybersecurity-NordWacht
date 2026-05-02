# Sentry Setup Guide

## 1. Create Sentry Account & Project
- Go to [Sentry.io](https://sentry.io/) and sign up/log in.
- Create a new project and select **Next.js** as the platform.

## 2. Install Sentry Wizard
Run the following command at the root of the project to automatically configure Sentry:

```bash
npx @sentry/wizard@latest -i nextjs
```

*Note: This wizard will install the `@sentry/nextjs` SDK, create the necessary configuration files (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`), and update your `next.config.ts`.*

## 3. Environment Variables
Add the DSN provided by Sentry to your local `.env.local` file (the wizard usually helps with this):

```env
NEXT_PUBLIC_SENTRY_DSN="your_sentry_dsn_here"
SENTRY_AUTH_TOKEN="your_sentry_auth_token_here"
```

## 4. Verify the Integration
To test if Sentry is capturing errors correctly, you can temporarily add a button to your app that throws an error:

```tsx
<button onClick={() => { throw new Error("Sentry Test Error"); }}>
  Trigger Sentry Error
</button>
```

Click the button, then check your Sentry dashboard to confirm the error was received.

## 5. Enable User Feedback (Optional)
To gather feedback when users hit an error, enable the Sentry Feedback widget in `sentry.client.config.ts`.
