# NordWacht Branding & Style Guide

This guide provides the core design tokens and styles used throughout the NordWacht application, specifically tailored as a reference for creating on-brand HTML email templates.

*(Note: Since email clients strip out many modern CSS features like flexbox and external web fonts, you will need to use standard inline CSS, but these colors and fonts will keep it looking identical).*

## 1. Typography

The web app uses the Vercel **Geist** font family. For HTML emails, you should use a web-safe fallback stack. 

*   **Font Family Stack:** `font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;`
*   **Headings:** Bold (`font-weight: 700`) or Extrabold (`font-weight: 800`).
*   **Body Text:** Regular (`font-weight: 400`), slightly smaller (e.g., `14px` or `15px`), with a relaxed line height (e.g., `line-height: 1.6;`).

## 2. Core Color Palette

The brand heavily relies on a sleek monochrome base (Zinc/Grays) accented by vibrant Blues and purples.

### Backgrounds (The Canvas)
*   **Light Mode Body:** `#ffffff` (White)
*   **Light Mode Secondary/Card:** `#f4f4f5` (Zinc 100)
*   **Dark Mode Body:** `#0a0a0a` (Very Dark Gray / Black)
*   **Dark Mode Secondary/Card:** `#18181b` (Zinc 900)

### Text Colors
*   **Light Mode Primary (Headings):** `#18181b` (Zinc 900)
*   **Light Mode Secondary (Paragraphs):** `#71717a` (Zinc 500)
*   **Dark Mode Primary (Headings):** `#ffffff` (White)
*   **Dark Mode Secondary (Paragraphs):** `#a1a1aa` (Zinc 400)

### Brand Accents (Buttons & Links)
*   **Primary Brand Blue:** `#2563eb` (Blue 600)
*   **Hover Blue:** `#1d4ed8` (Blue 700)
*   **Accent Indigo:** `#6366f1` (Indigo 500)
*   **Accent Purple:** `#9333ea` (Purple 600)

## 3. Signature UI Elements

To make the email feel like the application UI, incorporate these design tokens:

*   **The "NordWacht Gradient":** The app frequently uses a horizontal gradient bar (like the one at the top of the roadmap modal). You can use this as a slim divider or a top-border for your email card.
    *   *Gradient CSS:* `background: linear-gradient(to right, #2563eb, #6366f1, #9333ea);`
*   **Rounded Corners (Border Radius):** Elements are heavily rounded. Use `border-radius: 16px;` or `24px` for main content wrappers/cards, and `border-radius: 12px;` for buttons.
*   **Borders:** Use very subtle borders to separate content. 
    *   *Light Mode Border:* `1px solid #e4e4e7` (Zinc 200)
    *   *Dark Mode Border:* `1px solid #27272a` (Zinc 800)

## Example Email Button (Inline CSS)

```html
<a href="https://yourlink.com" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block; font-family: 'Geist', -apple-system, sans-serif;">
  View Your Roadmap
</a>
```
