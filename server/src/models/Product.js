import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  variants: [
    {
      size: String,
      color: String,
      stock: { type: Number, default: 0 },
      sku: String,
    },
  ],
  totalStock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  restockDate: { type: Date, default: null },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
