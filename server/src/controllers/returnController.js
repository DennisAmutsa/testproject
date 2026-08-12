import Return from '../models/Return.js';

// POST /api/returns  - submit a return request
export const createReturn = async (req, res) => {
  try {
    const { orderId, customerEmail, customerName, reason, notes } = req.body;
    if (!orderId || !customerEmail || !customerName || !reason) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const returnId = `RET-${Date.now()}`;
    const newReturn = await Return.create({ returnId, orderId, customerEmail, customerName, reason, notes });
    res.status(201).json({ message: 'Return request submitted successfully!', data: newReturn });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/returns/:returnId  - track return status
export const getReturnById = async (req, res) => {
  try {
    const returnRequest = await Return.findOne({ returnId: req.params.returnId });
    if (!returnRequest) return res.status(404).json({ message: 'Return request not found.' });
    res.json(returnRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/returns/email/:email  - get all returns for a customer
export const getReturnsByEmail = async (req, res) => {
  try {
    const returns = await Return.find({ customerEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/returns/policy  - return policy info
export const getReturnPolicy = async (req, res) => {
  res.json({
    windowDays: 30,
    eligibleConditions: ['Unused with original tags', 'Damaged on arrival', 'Wrong item received'],
    nonEligible: ['Items worn or washed', 'Items without receipt', 'Sale items marked final'],
    refundTimeline: '5–7 business days after item is received',
    process: [
      'Submit a return request below',
      'Receive a return label via email within 24 hours',
      'Ship the item back within 7 days',
      'Refund issued within 5–7 business days of receipt',
    ],
  });
};
