import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { upload } from '../utils/upload.js';
import { uploadIdProof, createBooking, getBooking, createCheckoutSession } from '../controllers/booking_controller.js';

const router = express.Router();

router.post('/upload-id', verifyToken, upload.single('idProof'), uploadIdProof);
router.post('/', verifyToken, createBooking);
router.get('/:id', verifyToken, getBooking);
router.post('/checkout-session', verifyToken, createCheckoutSession);

export default router;
