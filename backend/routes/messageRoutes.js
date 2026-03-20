import express from 'express';
import { getMessages, createMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getMessages)
    .post(protect, createMessage);

export default router;
