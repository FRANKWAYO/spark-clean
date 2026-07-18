const express = require("express");
const { requireFields } = require("../middleware/validate");
const { sendMail } = require("../config/mailer");

const router = express.Router();

// POST /api/newsletter — subscribe an email
router.post(
  "/",
  requireFields(["email"]),
  async (req, res, next) => {
    try {
      const email = req.body.email;

      await sendMail({
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: "New newsletter signup",
        html: `<p>New subscriber: ${email}</p>`,
      });

      res.status(201).json({ message: "Subscribed", subscriber: { email } });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
