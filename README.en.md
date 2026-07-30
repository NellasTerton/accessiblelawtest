# Lex CRM — LegalTech Dashboard (Test Task)

[Русский](./README.md) · **English**

🟢 **[Live Demo](https://accessiblelawtest.lovable.app)**

A prototype CRM for lawyers, built to validate a product hypothesis quickly.

## 📸 Interface

<!-- Drop the dashboard screenshot at docs/screenshot.png -->
<img src="https://github.com/user-attachments/assets/d3d14a88-024f-4567-ab73-9b6dd0da14d6" alt="Lex CRM dashboard: client table and per-status counters" width="50%">

## ⚡ Core features
*   **Lead management:** Add clients (name, phone, status) through a modal dialog.
*   **Dynamic statuses:** Change a status ("New", "In progress", "Closed") straight from the table.
*   **Analytics:** Per-status counters are calculated automatically and shown in the header.
*   **Data:** State is kept in `LocalStorage` — no heavyweight database to deploy.

## 🤖 Bonus: process automation
Adding a new client fires an automatic push notification.
Instead of a private bot, notifications go to a public Telegram channel (linked from the
dashboard UI) so a reviewer can watch the flow happen in real time.

**Automation pipeline:**
Frontend (Fetch POST) ➔ Webhook ➔ Make.com ➔ Telegram Bot API ➔ Public channel.

## 🛠 Tech stack
*   **Frontend:** React, TypeScript, Tailwind CSS (generated with Lovable).
*   **Automation:** Make.com, Telegram API.
