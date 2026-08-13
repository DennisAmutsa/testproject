import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';

const router = express.Router();

const CATEGORIES = [
  "Men's Clothing", "Women's Clothing", "Shoes & Footwear",
  "Bags & Accessories", "Electronics", "Beauty & Personal Care",
  "Kids' Clothing", "Sports & Fitness", "Home & Living"
];

// Get categories (public)
router.get('/categories', (req, res) => res.json(CATEGORIES));

// Search products (public)
router.get('/search', async (req, res) => {
  try {
    const { query, category } = req.query;
    const filter = {};
    if (query) filter.name = { $regex: query, $options: 'i' };
    if (category) filter.category = category;
    const products = await Product.find(filter).limit(20);
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter)
      .skip((page - 1) * limit).limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get single product (public)
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Subscribe to restock alert (public)
router.post('/:productId/notify', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (product.totalStock > 0) {
      return res.status(400).json({ message: 'This product is already in stock!' });
    }

    const StockAlert = (await import('../models/StockAlert.js')).default;
    await StockAlert.findOneAndUpdate(
      { email: email.toLowerCase().trim(), productId: req.params.productId },
      { email: email.toLowerCase().trim(), productId: req.params.productId, name: product.name, notified: false },
      { upsert: true, new: true }
    );

    res.json({ message: `We'll email you at ${email} when ${product.name} is back in stock!` });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - create product
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) return res.status(400).json({ message: 'Name, category and price required.' });
    if (!CATEGORIES.includes(category)) return res.status(400).json({ message: 'Invalid category.' });
    const productId = `PRD-${Date.now()}`;
    const totalStock = req.body.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
    const product = await Product.create({ ...req.body, productId, totalStock, isAvailable: totalStock > 0 });
    res.status(201).json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - update product (triggers restock emails if stock goes from 0 → available)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    // Capture previous stock state before update
    const prevProduct = await Product.findById(req.params.id);

    if (req.body.variants) {
      req.body.totalStock = req.body.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      req.body.isAvailable = req.body.totalStock > 0;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    // Trigger restock emails if product went from out-of-stock to in-stock
    const wasOutOfStock = prevProduct && prevProduct.totalStock === 0;
    const isNowInStock  = product.totalStock > 0;

    if (wasOutOfStock && isNowInStock) {
      // Fire and forget — don't block the response
      (async () => {
        try {
          const StockAlert = (await import('../models/StockAlert.js')).default;
          const { sendRestockEmail } = await import('../config/email.js');
          const alerts = await StockAlert.find({ productId: product.productId, notified: false });

          for (const alert of alerts) {
            try {
              await sendRestockEmail(alert.email, {
                name: product.name,
                category: product.category,
                totalStock: product.totalStock,
              });
              alert.notified  = true;
              alert.notifiedAt = new Date();
              await alert.save();
              console.log(`✅ Restock email sent to ${alert.email} for "${product.name}"`);
            } catch (emailErr) {
              console.error(`❌ Failed to email ${alert.email}:`, emailErr.message);
            }
          }
        } catch (err) {
          console.error('Restock notification error:', err.message);
        }
      })();
    }

    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - delete product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted.' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
