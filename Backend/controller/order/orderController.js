const orderModel = require('../../models/orderModel');
const userModel = require('../../models/userModel');

/**
 * Get orders for authenticated user with pagination
 */
async function getUserOrders(req, res) {
  try {
    const userId = req.userId; // From authToken middleware

    // Parse and validate pagination params
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(10, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Get total count and paginated orders in parallel
    const [total, orders] = await Promise.all([
      orderModel.countDocuments({ userId }),
      orderModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('products.productId', 'productName brandName category')
        .lean()
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: orders,
      total,
      page,
      totalPages
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
    if (!user || user.role !== 'SUPERADMIN') {
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

const VALID_DELIVERY_STATUSES = ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

/**
 * Update delivery status for an order (admin only)
 */
async function updateDeliveryStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;
    const userId = req.userId;

    // Validate deliveryStatus value
    if (!deliveryStatus || !VALID_DELIVERY_STATUSES.includes(deliveryStatus)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: `deliveryStatus must be one of: ${VALID_DELIVERY_STATUSES.join(', ')}`
      });
    }

    // Verify requesting user is an admin
    const user = await userModel.findById(userId);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return res.status(403).json({
        success: false,
        error: true,
        message: 'Access denied. Administrator privileges required.'
      });
    }

    // Update the order
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        deliveryStatus,
        deliveryStatusUpdatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating delivery status:', {
      orderId: req.params.orderId,
      userId: req.userId,
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: true,
      message: 'Unable to update delivery status. Please try again later.'
    });
  }
}

module.exports = {
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateDeliveryStatus
};
