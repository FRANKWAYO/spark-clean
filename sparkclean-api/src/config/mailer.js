const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[mailer] SMTP not configured — emails will be skipped (logged to console instead).');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

// Sends an email if SMTP is configured. Never throws — a failed email should
// never break a booking/quote/contact submission, so callers can fire-and-forget.
async function sendMail({ to, subject, html }) {
  const t = getTransporter();

  if (!t) {
    console.log(`[mailer] (skipped — no SMTP configured) Would have sent "${subject}" to ${to}`);
    return { sent: false };
  }

  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || `"SparkClean Services" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] Failed to send email:', err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendMail };
