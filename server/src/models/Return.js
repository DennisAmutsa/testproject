import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema({
  returnId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  reason: {
    type: String,
    enum: ['damaged', 'wrong_item', 'not_as_described', 'changed_mind', 'other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'received', 'refund_processing', 'refunded'],
    default: 'requested',
  },
  refundAmount: { type: Number, default: 0 },
  refundMethod: { type: String, enum: ['original_payment', 'store_credit', 'bank_transfer'], default: 'original_payment' },
  notes: { type: String, default: '' },
  resolvedAt: { type: Date, default: null },
}, { timestamps: true });

const Return = mongoose.model('Return', returnSchema);
export default Return;
