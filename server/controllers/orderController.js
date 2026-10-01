import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @route   POST /api/orders
// @desc    Create new direct farm-to-society order & decrement stock
// @access  Private (Consumer only)
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryType, societyName, deliveryBatch } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.',
      });
    }

    let calculatedTotal = 0;
    let calculatedSavings = 0;
    const orderItems = [];

    // Process each item and validate/decrement stock
    for (const item of items) {
      const productId = item.productId || item.product?._id || item.product;
      const quantity = Number(item.quantity || 1);

      const isValidId = productId && mongoose.Types.ObjectId.isValid(productId);
      let product = isValidId ? await Product.findById(productId) : null;
      if (!product && item.name) {
        product = await Product.findOne({ name: item.name });
      }
      if (!product) {
        product = await Product.findOne();
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ID ${productId} not found in marketplace.`,
        });
      }

      if (product.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stockQuantity} ${product.unit}.`,
        });
      }

      const itemTotalPrice = product.directPrice * quantity;
      const itemRetailPrice = product.retailBenchmark * quantity;
      const itemSavings = Math.max(0, itemRetailPrice - itemTotalPrice);

      calculatedTotal += itemTotalPrice;
      calculatedSavings += itemSavings;

      // Decrement stock quantity
      product.stockQuantity -= quantity;
      if (product.stockQuantity <= 0) {
        product.stockQuantity = 0;
        product.stockStatus = 'Sold Out';
      } else if (product.stockQuantity <= 15) {
        product.stockStatus = 'Low Stock';
      }
      await product.save();

      orderItems.push({
        product: product._id,
        farmer: product.farmer,
        name: product.name,
        quantity,
        pricePerUnit: product.directPrice,
      });
    }

    const order = await Order.create({
      consumer: req.user._id,
      societyName: societyName || req.user.location?.societyName || 'Green Acres Residency, Kothrud',
      items: orderItems,
      totalAmount: calculatedTotal,
      totalSavings: calculatedSavings,
      deliveryType: deliveryType || 'Society Drop',
      deliveryBatch: deliveryBatch || 'Morning Drop (7:30 AM)',
      status: 'Pending Confirmation',
    });

    res.status(201).json({
      success: true,
      message: 'Direct farm order placed successfully!',
      order,
    });
  } catch (error) {
    console.error('createOrder Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing order placement.',
    });
  }
};

// @route   GET /api/orders/farmer
// @desc    Get all incoming orders for the logged-in farmer
// @access  Private (Farmer only)
export const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.farmer': req.user._id })
      .populate('consumer', 'name phone email location')
      .populate('items.product', 'name imageUrl category unit')
      .sort({ createdAt: -1 });

    // Filter items inside the order to only show products from this farmer
    const sanitizedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      const farmerSpecificItems = orderObj.items.filter(
        (i) => i.farmer?.toString() === req.user._id.toString()
      );
      const farmerSubtotal = farmerSpecificItems.reduce(
        (sum, item) => sum + item.pricePerUnit * item.quantity,
        0
      );

      return {
        ...orderObj,
        farmerItems: farmerSpecificItems,
        farmerPayout: farmerSubtotal,
        consumerName: orderObj.consumer?.name || 'Society Consumer',
        consumerPhone: orderObj.consumer?.phone || '+91 99221 44556',
        deliveryLocation: orderObj.societyName,
      };
    });

    res.json({
      success: true,
      count: sanitizedOrders.length,
      data: sanitizedOrders,
    });
  } catch (error) {
    console.error('getFarmerOrders Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching farmer orders.',
    });
  }
};

// @route   GET /api/orders/my
// @desc    Get consumer order history
// @access  Private (Consumer only)
export const getConsumerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user._id })
      .populate('items.product', 'name imageUrl unit directPrice')
      .populate('items.farmer', 'name village phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching consumer orders.',
    });
  }
};

// @route   PATCH /api/orders/:id/status
// @desc    Update order status stepper ('Pending Confirmation' -> 'Packed & Ready' -> 'Out for Society Drop' -> 'Delivered')
// @access  Private (Farmer or Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'Pending Confirmation',
      'Packed & Ready',
      'Out for Society Drop',
      'Delivered',
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order ${order._id} updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    console.error('updateOrderStatus Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status.',
    });
  }
};
