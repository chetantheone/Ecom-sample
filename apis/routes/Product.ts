import express from 'express';
import controller from '../controllers/Product';

const router = express.Router();

router.get('/get', controller.readAll);

export default router;
