import { Router } from 'express';
import { addProducts, downloadQuotation, viewQuotations } from '../controllers/quotationController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add-products', authenticate, addProducts);
router.get('/quotations', authenticate, viewQuotations);
router.get('/quotations/:id/download', authenticate, downloadQuotation);

export default router;
