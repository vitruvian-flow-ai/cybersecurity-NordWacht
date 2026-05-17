# Calendly Integration Plan (Updated: Multi-Step Modal)

This plan covers the implementation of a high-conversion booking flow using a custom multi-step modal before presenting the Calendly widget.

## A) Recommended Embed Approach
**Selected: Custom Site Modal + Inline Embed (Final Step)**

### Reasoning:
1. **Qualification**: By asking questions *before* the calendar appears, we qualify leads and prepare the technical team for the audit.
2. **Data Continuity**: We capture Name and Email early. If the user drops off before picking a time, we still have their contact info (optional: can be sent to a lead capture endpoint).
3. **Seamless UX**: We control the modal design (Tailwind/CSS) so it matches the site branding perfectly, only using Calendly for the final scheduling step.
4. **Automated Prefill**: All data from the pre-steps is passed to Calendly via the `prefill` JS API, so the user doesn't have to type their name/email twice.

---

## B) Step-by-Step Task List

### 1. Configuration
- [ ] Update `.env.local` with the specific Calendly URL and branding colors.
- [ ] Map "Invitee Questions" in Calendly (a1, a2, a3, etc.) to the 5 audit questions.

### 2. Multi-Step Modal Development
- [ ] Create `src/components/booking/BookingModal.tsx`:
    - **Step 1**: User Contact (Name, Email).
    - **Step 2**: Technical Audit Questions (5 dropdowns/inputs).
    - **Step 3**: Calendly Inline Widget (Visible once Step 1 & 2 are complete).
- [ ] Implement state management to track progress and form data.

### 3. Audit Questions (Proposed)
1. **Org Size**: 1-50, 50-500, 500+ endpoints.
2. **Environment**: Cloud, On-Prem, Hybrid.
3. **Compliance**: ISO 27001, SOC2, HIPAA, GDPR, etc.
4. **Top Priority**: Data Breach, Phishing, Compliance, Managed SOC.
5. **Role**: IT Manager, C-Suite, Security Analyst, Owner.

### 4. Integration
- [ ] Add trigger logic to "Request Demo" (Header) and "Book Technical Audit" (Hero/CTA) buttons.
- [ ] Load Calendly `widget.js` using `next/script` in `layout.tsx` or the component.

### 5. Data Transport
- [ ] Use `Calendly.initInlineWidget` in the final step with the `prefill` object:
  ```javascript
  prefill: {
    name: formData.name,
    email: formData.email,
    customAnswers: {
      a1: formData.orgSize,
      a2: formData.environment,
      // ... etc
    }
  }
  ```

---

## C) Files/Components to Add or Modify

| File Path | Description |
| :--- | :--- |
| `src/components/booking/BookingModal.tsx` | The multi-step form engine. |
| `src/components/booking/StepContact.tsx` | Form for Name/Email. |
| `src/components/booking/StepAudit.tsx` | Form for the 5 technical questions. |
| `src/components/booking/CalendlyStep.tsx` | Wrapper for the Calendly `div` and init script. |
| `src/components/layout/Header.tsx` | Hook up "Request Demo" button. |
| `src/app/layout.tsx` | Include the `BookingModal` globally or via a Context Provider. |

---

## D) Environment/Config

```env
# Calendly Configuration
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/rosswell-vitruvianflow/30min
NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR=0069ff
NEXT_PUBLIC_CALENDLY_TEXT_COLOR=4d5055
NEXT_PUBLIC_CALENDLY_BG_COLOR=ffffff
```

---

## E) QA Checklist

- [ ] **Data Flow**: Verify Name/Email appear automatically in the Calendly step.
- [ ] **Modal Responsiveness**: Ensure the multi-step form is easy to use on mobile.
- [ ] **State Reset**: Closing the modal should reset the form (or save progress if desired).
- [ ] **Accessibility**: Ensure the modal is keyboard navigable (ESC to close, Tab focus).
- [ ] **Validation**: Ensure Email is valid before allowing progress to the audit step.

---

## F) Future Upgrades
- **Lead Capture**: Send Step 1 data to a webhook immediately upon completion (before booking).
- **Abandoned Booking Tracking**: Track if users reach Step 3 but don't finish.
