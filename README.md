# SparkClean Services

A full-stack web presence for **SparkClean Services**, a professional cleaning agency. This project includes a marketing website and a lightweight backend API for handling bookings, quotes, and customer contact requests.

## 🧹 About SparkClean Services

SparkClean Services offers professional home and office cleaning solutions. This repository powers the company's online presence — helping customers view services, get instant quotes, and book cleanings directly from the website.

## Features

- **Before/After Comparison Tool** — interactive slider showcasing cleaning results
- **Quote Calculator** — instant price estimates based on service type and space size
- **Booking Form** — customers can request a cleaning appointment online
- **Contact Form** — general inquiries routed straight to the admin's inbox
- **WhatsApp Integration** — quick-contact button linking directly to WhatsApp chat
- **Email Notifications** — booking, quote, and contact requests are emailed instantly (no database required)

## Project Structure

```
spark-clean/
├── index.html          # Main marketing site (HTML/CSS/JS)
├── flyer.png            # Promotional flyer
├── images/               # Site images
├── sparkclean-api/       # Node.js/Express backend API
│   ├── .env.example      # Template for required environment variables
│   └── ...
└── .gitignore
```

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (static site)
- **Backend:** Node.js, Express
- **Email:** Nodemailer via SMTP (Gmail App Password, SendGrid, or Mailgun compatible)
- **No database** — all requests are processed and delivered via email in real time

## Getting Started (Backend API)

1. Navigate to the API folder:
   ```
   cd sparkclean-api
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the environment template and fill in real values:
   ```
   cp .env.example .env
   ```
4. Start the server:
   ```
   npm start
   ```

**Never commit your real `.env` file.** Only `.env.example` (placeholder values) should be tracked in git.

## Environment Variables

See `sparkclean-api/.env.example` for the full list, including:
- SMTP configuration (host, port, user, password, from address)
- Admin notification email
- Frontend origin (CORS)
- WhatsApp contact number

## Deployment

- **Frontend:** Can be hosted for free via GitHub Pages
- **Backend API:** Deploy to a Node-friendly host such as Render or Railway, and set the environment variables listed above directly in that platform's dashboard (not via `.env`)

## Contact

For business inquiries related to SparkClean Services, reach out via the contact form on the live site or through the WhatsApp button.

---

*This project is privately maintained by FRANKWAYO.*
