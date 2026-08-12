import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'processing',
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      image: { type: String, default: '' },
    },
  ],
  trackingNumber: { type: String, default: null },
  estimatedDelivery: { type: Date },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
