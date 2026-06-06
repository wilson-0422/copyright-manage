import { Router } from 'express';
import { listWorks, getWorkDetail, showCreateWork, createWork, showEditWork, updateWork, deleteWork } from '../controllers/workController';

const router = Router();

router.get('/', listWorks);
router.get('/create', showCreateWork);
router.post('/create', createWork);
router.get('/:id', getWorkDetail);
router.get('/:id/edit', showEditWork);
router.post('/:id/edit', updateWork);
router.post('/:id/delete', deleteWork);

export default router;
