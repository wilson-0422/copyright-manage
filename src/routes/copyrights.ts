import { Router } from 'express';
import { listCopyrights, getCopyrightDetail, showRegisterCopyright, registerCopyright, confirmCopyright, rejectCopyright, traceCopyright } from '../controllers/copyrightController';

const router = Router();

router.get('/', listCopyrights);
router.get('/register', showRegisterCopyright);
router.post('/register', registerCopyright);
router.get('/trace', traceCopyright);
router.get('/:id', getCopyrightDetail);
router.post('/:id/confirm', confirmCopyright);
router.post('/:id/reject', rejectCopyright);

export default router;
