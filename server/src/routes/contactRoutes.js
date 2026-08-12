import express from 'express';
import { submitContact, getAllContacts, updateContactStatus } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, adminOnly, getAllContacts);
router.patch('/:id/status', protect, adminOnly, updateContactStatus);

export default router;
