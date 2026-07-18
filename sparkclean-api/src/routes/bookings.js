const express = require("express");
const { sendMail } = require("../config/mailer");
const { requireFields } = require("../middleware/validate");

const router = express.Router();

// POST /api/bookings — create a new booking (called from the website's booking form)
router.post(
  "/",
  requireFields([
    "name",
    "phone",
    "email",
    "address",
    "cleaningType",
    "preferredDate",
    "preferredTime",
  ]),
  async (req, res, next) => {
    try {
      const booking = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        cleaningType: req.body.cleaningType,
        propertySize: req.body.propertySize,
        preferredDate: req.body.preferredDate,
        preferredTime: req.body.preferredTime,
        frequency: req.body.frequency || "One-time",
        notes: req.body.notes,
      };

      await sendMail({
        to: booking.email,
        subject: "Your SparkClean booking is confirmed",
        html: `<p>Hi ${booking.name},</p><p>Thanks for booking a <strong>${booking.cleaningType}</strong> on ${booking.preferredDate} at ${booking.preferredTime}. We'll be in touch to confirm your cleaner.</p>`,
      });

      await sendMail({
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New booking: ${booking.name} — ${booking.cleaningType}`,
        html: `<p>New booking received.</p><pre>${JSON.stringify(booking, null, 2)}</pre>`,
      });

      res.status(201).json({ message: "Booking received", booking });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/bookings — list bookings (for an admin dashboard later)
router.get("/", (req, res) => {
  res.status(503).json({
    error: "Database disabled. Admin booking listing is unavailable.",
  });
});

// PATCH /api/bookings/:id — update status (admin use)
router.patch("/:id", (req, res) => {
  res.status(503).json({
    error: "Database disabled. Booking status update is unavailable.",
  });
});

module.exports = router;
