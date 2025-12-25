/**
 * M-Pesa status endpoint
 * Accessible at: /api/mpesa/status
 */
module.exports = async (req, res) => {
  const isConfigured = process.env.MPESA_CONSUMER_KEY && 
                       process.env.MPESA_CONSUMER_KEY !== 'YOUR_CONSUMER_KEY';
  
  res.json({
    configured: isConfigured,
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
    shortcode: process.env.MPESA_SHORTCODE || '174379',
    message: isConfigured 
      ? 'M-Pesa is configured and ready' 
      : 'M-Pesa credentials not configured. Please update environment variables in Vercel.'
  });
};

