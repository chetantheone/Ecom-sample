import express from 'express';
import controller from '../controllers/Cart';

const router = express.Router();

router.post('/create', controller.createCart);
router.get('/current', controller.getCurrentActiveCart);
export default router;