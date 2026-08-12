import Product from '../models/Product.js';

// GET /api/stock  - search products by name or category
export const searchProducts = async (req, res) => {
  try {
    const { query, category } = req.query;
    const filter = {};
    if (query) filter.name = { $regex: query, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    const products = await Product.find(filter).limit(20);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/stock/:productId  - get single product stock
export const getProductStock = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/stock/seed  - seed demo products (dev only)
export const seedProducts = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'Seed only available in development' });
  }
  try {
    await Product.deleteMany({});
    const demoProducts = [
      {
        productId: 'PRD-001',
        name: 'Blue Denim Jacket',
        category: 'Jackets',
        description: 'Classic blue denim jacket for all seasons',
        price: 4500,
        variants: [
          { size: 'S', color: 'Blue', stock: 0, sku: 'DJ-S-BLU' },
          { size: 'M', color: 'Blue', stock: 3, sku: 'DJ-M-BLU' },
          { size: 'L', color: 'Blue', stock: 0, sku: 'DJ-L-BLU' },
        ],
        totalStock: 3,
        isAvailable: true,
        restockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        productId: 'PRD-002',
        name: 'White Sneakers',
        category: 'Shoes',
        description: 'Clean white sneakers, perfect everyday wear',
        price: 3200,
        variants: [
          { size: '40', color: 'White', stock: 5, sku: 'WS-40-WHT' },
          { size: '41', color: 'White', stock: 0, sku: 'WS-41-WHT' },
          { size: '42', color: 'White', stock: 2, sku: 'WS-42-WHT' },
        ],
        totalStock: 7,
        isAvailable: true,
      },
      {
        productId: 'PRD-003',
        name: 'Summer Floral Dress',
        category: 'Dresses',
        description: 'Light and breezy summer dress with floral print',
        price: 2800,
        variants: [
          { size: 'XS', color: 'Pink', stock: 0, sku: 'FD-XS-PNK' },
          { size: 'S', color: 'Pink', stock: 0, sku: 'FD-S-PNK' },
        ],
        totalStock: 0,
        isAvailable: false,
        restockDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    ];
    await Product.insertMany(demoProducts);
    res.json({ message: '✅ Demo products seeded', count: demoProducts.length });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
};
