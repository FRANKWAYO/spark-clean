const express = require("express");
const { sendMail } = require("../config/mailer");
const { requireFields } = require("../middleware/validate");

const router = express.Router();

// POST /api/quotes — save a quote request (called from the instant quote calculator)
router.post(
  "/",
  requireFields([
    "propertyType",
    "squareFootage",
    "rooms",
    "bathrooms",
    "estimatedPrice",
  ]),
  async (req, res, next) => {
    try {
      const quote = {
        name: req.body.name,
        contact: req.body.contact,
        propertyType: req.body.propertyType,
        squareFootage: req.body.squareFootage,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        services: req.body.services || [],
        estimatedPrice: req.body.estimatedPrice,
      };

      if (quote.contact && quote.contact.includes("@")) {
        await sendMail({
          to: quote.contact,
          subject: "Your SparkClean quote estimate",
          html: `<p>Thanks for requesting a quote! Your estimate is <strong>GH₵${quote.estimatedPrice}</strong>. We'll confirm the final price after a quick walkthrough.</p>`,
        });
      }

      await sendMail({
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New quote request — GH₵${quote.estimatedPrice}`,
        html: `<pre>${JSON.stringify(quote, null, 2)}</pre>`,
      });

      res.status(201).json({ message: "Quote request received", quote });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/quotes — list quote requests (admin use)
router.get("/", (req, res) => {
  res.status(503).json({
    error: "Database disabled. Admin quote listing is unavailable.",
  });
});

module.exports = router;
