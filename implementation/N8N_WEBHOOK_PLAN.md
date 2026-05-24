# N8N Webhook Integration Plan

## Goal Description
Replace the current `mailto:` setup in the "Get My Full Audit RoadMap" modal with an automated n8n workflow using webhooks. The webhook URLs and any credentials will be securely stored as environment variables since no admin dashboard is required.

## User Review Required
> [!IMPORTANT]
> - Please confirm the exact environment variable names you'd like to use (e.g., `N8N_WEBHOOK_URL` and `N8N_API_KEY` if authentication is needed).
> - Let me know if the n8n webhook expects a specific JSON schema or if forwarding the quiz answers + contact details as-is is sufficient.

## Open Questions
> [!WARNING]
> - Do you want to include any error handling/retry logic in case the n8n webhook fails or times out?
> - What should the user see on the UI upon successful submission? Currently, we plan to show a success state inside the modal.

## Proposed Changes

### Environment Configuration
#### [MODIFY] .env.local
- Add `N8N_WEBHOOK_URL` to store the endpoint for the n8n workflow.

---

### Backend / API Routes
#### [NEW] src/app/api/submit-audit/route.ts
- Create a new Next.js API route that accepts POST requests from the client.
- Validate the incoming payload (first name, last name, email, gdpr consent, and the 3 quiz answers).
- Read the n8n webhook URL from environment variables.
- Securely execute a `fetch` POST request to the n8n webhook with the JSON payload.
- Return a success/error response to the frontend.

---

### Frontend / UI Components
#### [MODIFY] src/components/booking/RoadmapModal.tsx
- Remove the existing `mailto:` logic.
- Introduce an `isLoading` state to show a spinner or loading indicator during form submission.
- Modify the form submission handler to execute a `fetch` POST request to `/api/submit-audit`.
- Upon success, progress the modal state to a "success" view instead of opening the user's mail client.
- Display relevant error messages in the modal if the API returns an error.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- Attempt to submit the form locally without filling out required fields and verify validation errors.
- Ensure the loading state is visible during submission.
- Submit a valid form and verify the POST payload successfully reaches the specified n8n webhook.
- Check that the UI correctly advances to the success state.
