const orderModel = require('../../models/orderModel');

/**
 * Check if the authenticated user has purchased a specific product
 * GET /api/orders/check-purchase/:productId
 */
async function checkPurchase(req, res) {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const order = await orderModel.findOne({
      userId,
      status: { $in: ['paid', 'pending'] },
      'products.productId': productId
    });

    return res.status(200).json({
      success: true,
      hasPurchased: !!order
    });

  } catch (error) {
    console.error('checkPurchase error:', error);
    return res.status(500).json({ success: false, hasPurchased: false });
  }
}

module.exports = { checkPurchase };
