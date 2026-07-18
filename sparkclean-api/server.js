require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./src/middleware/errorHandler');

const bookingsRouter = require('./src/routes/bookings');
const quotesRouter = require('./src/routes/quotes');
const contactRouter = require('./src/routes/contact');
const newsletterRouter = require('./src/routes/newsletter');

const app = express();
const PORT = process.env.PORT || 5000;
const rootDir = path.join(__dirname, '..');

// ---------- Core middleware ----------
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

// Only allow requests from your actual website domain(s) in production.
// Set FRONTEND_ORIGIN in .env, e.g. "https://sparkclean.example.com"
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  })
);

// Basic protection against form-spam / brute force on public POST endpoints
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window per IP
  message: { error: 'Too many requests — please try again in a few minutes.' },
});
app.use('/api/bookings', formLimiter);
app.use('/api/quotes', formLimiter);
app.use('/api/contact', formLimiter);
app.use('/api/newsletter', formLimiter);

// ---------- Routes ----------
app.use(express.static(rootDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/bookings', bookingsRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

// ---------- Boot ----------
app.listen(PORT, () => {
  console.log(`[server] SparkClean API running on http://localhost:${PORT}`);
});

module.exports = app;
