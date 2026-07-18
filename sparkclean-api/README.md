# SparkClean API

Backend for the SparkClean Services website — handles bookings, quote requests, contact
messages and newsletter signups. Node.js + Express, with email notifications via SMTP
(works with Gmail, SendGrid, Mailgun, etc.).

## 1. Run it locally

```bash
npm install
cp .env.example .env
# edit .env — at minimum, set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, ADMIN_EMAIL
npm run dev        # auto-restarts on changes (nodemon)
# or: npm start
```

Server runs on `http://localhost:5000` by default. Check it's alive:

```bash
curl http://:5000/api/health
```

## 2. Email notifications

This API sends booking, quote, contact, and newsletter messages via SMTP only. No database is used, so submissions are not persisted.

If SMTP isn't configured, the API still works — it logs `[mailer] (skipped...)` instead of sending email.

## 3. Set up email notifications (required)

Use any SMTP provider. For Gmail:
1. Turn on 2-Step Verification on the Google account
2. Create an "App Password" (Google Account → Security → App passwords)
3. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=you@gmail.com`, `SMTP_PASS=<app password>`

If SMTP isn't configured, the API still works — it just logs `[mailer] (skipped...)`
instead of sending, so bookings/quotes/contact submissions are never blocked by email.

## 4. API endpoints

| Method | Path                | Purpose                                  |
|--------|---------------------|-------------------------------------------|
| GET    | /api/health         | Health check (no DB required)             |
| POST   | /api/bookings       | Create a booking                           |
| GET    | /api/bookings       | List bookings (for an admin dashboard)     |
| PATCH  | /api/bookings/:id   | Update a booking's status                  |
| POST   | /api/quotes         | Save a quote request                       |
| GET    | /api/quotes         | List quote requests                        |
| POST   | /api/contact        | Save a contact message                     |
| POST   | /api/newsletter     | Subscribe an email                         |

All POST endpoints expect `Content-Type: application/json` and return `400` with a
`fields` array if anything required is missing.

## 5. Deploy

**API (Render — free tier):**
1. Push this folder to a GitHub repo
2. https://render.com → New → Web Service → connect the repo
3. Build command: `npm install` · Start command: `npm start`
4. Add the same environment variables from `.env` in Render's dashboard
5. Once deployed you'll get a URL like `https://sparkclean-api.onrender.com`

(Railway and Fly.io work the same way if you prefer those.)

**Frontend:**
Update the `API_BASE` constant near the top of the website's `<script>` block to your
deployed API URL, then host `index.html` on Netlify, Vercel, or GitHub Pages.

Also set `FRONTEND_ORIGIN` in the API's environment variables to your live website URL
(e.g. `https://sparkclean.example.com`) so CORS only allows your real site, not `*`.

## 6. What's next

This API covers bookings/quotes/contact/newsletter, which is what the current website
needs. When you're ready for the rest:
- **Auth + dashboards**: add Clerk/Auth0 for login, then a `role: admin` check on the
  existing GET /api/bookings and GET /api/quotes routes
- **Payments**: Paystack or Flutterwave (support Mobile Money) — create a checkout
  session server-side after a booking is created, verify via webhook
- **SMS**: Africa's Talking or Twilio, triggered in the same place the confirmation
  email is sent in `src/routes/bookings.js`
