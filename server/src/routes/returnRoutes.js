import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import Return from '../models/Return.js';

const router = express.Router();

// Return policy (public)
router.get('/policy', (req, res) => {
  res.json({
    windowDays: 30,
    eligibleConditions: ['Unused with original tags', 'Damaged on arrival', 'Wrong item received'],
    nonEligible: ['Items worn or washed', 'Items without receipt', 'Final sale items'],
    refundTimeline: '5–7 business days after item is received',
    process: ['Submit a return request', 'Receive return label via email within 24hrs', 'Ship item back within 7 days', 'Refund issued within 5–7 business days'],
  });
});

// Customer - my returns
router.get('/my', protect, async (req, res) => {
  try {
    const returns = await Return.find({ customerEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(returns);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Customer - submit return
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, reason, notes } = req.body;
    if (!orderId || !reason) return res.status(400).json({ message: 'Order ID and reason are required.' });
    const returnId = `RET-${Date.now()}`;
    const newReturn = await Return.create({
      returnId, orderId,
      customerEmail: req.user.email,
      customerName: req.user.name,
      reason, notes,
    });
    res.status(201).json({ message: 'Return request submitted!', data: newReturn });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Track by returnId (public)
router.get('/:returnId', async (req, res) => {
  try {
    const r = await Return.findOne({ returnId: req.params.returnId });
    if (!r) return res.status(404).json({ message: 'Return not found.' });
    res.json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - all returns
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const returns = await Return.find().sort({ createdAt: -1 });
    res.json(returns);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin - update return status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const update = { status: req.body.status };
    if (['refunded', 'rejected'].includes(req.body.status)) update.resolvedAt = new Date();
    if (req.body.refundAmount) update.refundAmount = req.body.refundAmount;
    const r = await Return.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!r) return res.status(404).json({ message: 'Return not found.' });
    res.json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
