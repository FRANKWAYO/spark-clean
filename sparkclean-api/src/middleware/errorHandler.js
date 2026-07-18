// Catches anything thrown/rejected in routes so a single bug can't crash the process,
// and keeps error responses in a consistent shape for the frontend to handle.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[error]', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on our end. Please try again shortly.',
  });
}

module.exports = errorHandler;
