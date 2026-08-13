import mongoose from "mongoose";

const stockAlertSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true, trim: true },
  productId: { type: String, required: true },
  name:      { type: String },           // cached for display
  notified:  { type: Boolean, default: false },
  notifiedAt:{ type: Date,    default: null  },
}, { timestamps: true });

// Prevent duplicate alerts for same email+product
stockAlertSchema.index({ email: 1, productId: 1 }, { unique: true });

export default mongoose.model("StockAlert", stockAlertSchema);
