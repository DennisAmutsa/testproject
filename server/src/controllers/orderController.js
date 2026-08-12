import Order from '../models/Order.js';

// GET /api/orders/:orderId  - track by order ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: 'Order not found. Please check your order ID.' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/orders/email/:email  - get all orders for a customer
export const getOrdersByEmail = async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/orders/seed  - seed demo orders (dev only)
export const seedOrders = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'Seed only available in development' });
  }
  try {
    await Order.deleteMany({});
    const demoOrders = [
      {
        orderId: 'NS-10021',
        customerEmail: 'jane@example.com',
        customerName: 'Jane Wanjiku',
        status: 'shipped',
        items: [{ name: 'Blue Denim Jacket', quantity: 1, price: 4500 }],
        trackingNumber: 'KE-TRK-88821',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        shippedAt: new Date(),
      },
      {
        orderId: 'NS-10022',
        customerEmail: 'john@example.com',
        customerName: 'John Kamau',
        status: 'processing',
        items: [{ name: 'White Sneakers', quantity: 2, price: 3200 }],
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: 'NS-10023',
        customerEmail: 'mary@example.com',
        customerName: 'Mary Atieno',
        status: 'delivered',
        items: [{ name: 'Summer Dress', quantity: 1, price: 2800 }],
        trackingNumber: 'KE-TRK-88654',
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];
    await Order.insertMany(demoOrders);
    res.json({ message: '✅ Demo orders seeded', count: demoOrders.length });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
};
