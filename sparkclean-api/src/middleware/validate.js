// Minimal dependency-free validator: pass in a list of required field names,
// get a 400 with a clear message if any are missing or blank.
function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => {
      const val = req.body[f];
      return val === undefined || val === null || String(val).trim() === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Missing required field(s)',
        fields: missing,
      });
    }

    next();
  };
}

module.exports = { requireFields };
