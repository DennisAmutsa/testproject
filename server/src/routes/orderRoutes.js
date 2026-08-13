import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// Customer - get own orders by email
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.user.email }).sort({ createdAt: -1 }).lean();
    for (const order of orders) {
      if (order.items) {
        for (const item of order.items) {
          const prod = await Product.findOne({ name: item.name });
          if (prod) {
            item.image = prod.image;
          }
        }
      }
    }
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Public - get own orders by email
router.get('/email/:email', async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.params.email }).sort({ createdAt: -1 }).lean();
    for (const order of orders) {
      if (order.items) {
        for (const item of order.items) {
          const prod = await Product.findOne({ name: item.name });
          if (prod) {
            item.image = prod.image;
          }
        }
      }
    }
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Public - track by orderId
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found. Please check your order ID.' });
    if (order.items) {
      for (const item of order.items) {
        const prod = await Product.findOne({ name: item.name });
        if (prod) {
          item.image = prod.image;
        }
      }
    }
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    for (const order of orders) {
      if (order.items) {
        for (const item of order.items) {
          const prod = await Product.findOne({ name: item.name });
          if (prod) {
            item.image = prod.image;
          }
        }
      }
    }
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - create order
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { orderId, customerEmail, customerName, items, estimatedDelivery } = req.body;
    if (!orderId || !customerEmail || !customerName || !items?.length)
      return res.status(400).json({ message: 'All fields required.' });
    const exists = await Order.findOne({ orderId });
    if (exists) return res.status(400).json({ message: 'Order ID already exists.' });
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - update order status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const update = { status: req.body.status };
    if (req.body.status === 'shipped') { update.shippedAt = new Date(); update.trackingNumber = req.body.trackingNumber; }
    if (req.body.status === 'delivered') update.deliveredAt = new Date();
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - delete order
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
