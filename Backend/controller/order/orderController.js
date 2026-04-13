const orderModel = require('../../models/orderModel');
const userModel = require('../../models/userModel');

/**
 * Get orders for authenticated user
 */
async function getUserOrders(req, res) {
  try {
    const userId = req.userId; // From authToken middleware

    // Query orders by userId, sort by creation date descending
    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'productName brandName category')
      .lean();

    return res.status(200).json({
      success: true,
      error: false,
      data: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('Error fetching user orders:', {
      userId: req.userId,
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: true,
      message: 'Unable to fetch orders. Please try again later.'
    });
  }
}

/**
 * Get all orders (admin only)
 * Supports filtering by status and search by customer email/name
 */
async function getAllOrders(req, res) {
  try {
    const userId = req.userId;

    // Verify user is admin
    const user = await userModel.findById(userId);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: true,
        message: 'Access denied. Administrator privileges required.'
      });
    }

    // Build query based on filters
    const query = {};
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Search by customer email or name if provided
    if (req.query.search) {
      query.$or = [
        { customerEmail: { $regex: req.query.search, $options: 'i' } },
        { customerName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Query all orders with filters
    const orders = await orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('products.productId', 'productName brandName category')
      .lean();

    return res.status(200).json({
      success: true,
      error: false,
      data: orders,
      total: orders.length
    });

  } catch (error) {
    console.error('Error fetching all orders:', {
      userId: req.userId,
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: true,
      message: 'Unable to fetch orders. Please try again later.'
    });
  }
}

/**
 * Get specific order by ID
 * Verifies user owns order or is admin
 */
async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    // Fetch order
    const order = await orderModel
      .findById(orderId)
      .populate('userId', 'name email')
      .populate('products.productId', 'productName brandName category productImage')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Order not found'
      });
    }

    // Verify user owns order or is admin
    const user = await userModel.findById(userId);
    const isOwner = order.userId._id.toString() === userId.toString();
    const isAdmin = user && user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: true,
        message: 'Access denied. You can only view your own orders.'
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order by ID:', {
      orderId: req.params.orderId,
      userId: req.userId,
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: true,
      message: 'Unable to fetch order details. Please try again later.'
    });
  }
}

module.exports = {
  getUserOrders,
  getAllOrders,
  getOrderById
};
