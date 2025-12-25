/**
 * Health check endpoint
 * Accessible at: /api/health
 */
module.exports = async (req, res) => {
  res.json({
    status: 'ok',
    service: '43_Industries POS',
    timestamp: new Date().toISOString(),
    platform: 'Vercel'
  });
};

