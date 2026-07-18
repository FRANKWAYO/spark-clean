const express = require("express");
const { sendMail } = require("../config/mailer");
const { requireFields } = require("../middleware/validate");

const router = express.Router();

// POST /api/contact — the general contact form
router.post(
  "/",
  requireFields(["name", "email", "message"]),
  async (req, res, next) => {
    try {
      const contact = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
      };

      await sendMail({
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New contact message: ${contact.subject || "No subject"}`,
        html: `<p>From: ${contact.name} (${contact.email})</p><p>${contact.message}</p>`,
      });

      res.status(201).json({ message: "Message sent", contact });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
