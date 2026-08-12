import express from 'express';
import { getHelpTopics, searchHelp } from '../controllers/helpController.js';

const router = express.Router();

router.get('/topics', getHelpTopics);
router.get('/search', searchHelp);

export default router;
