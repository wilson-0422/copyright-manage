import { Router } from 'express';
import { listContracts, getContractDetail, showCreateContract, createContract, activateContract, terminateContract } from '../controllers/contractController';

const router = Router();

router.get('/', listContracts);
router.get('/create', showCreateContract);
router.post('/create', createContract);
router.get('/:id', getContractDetail);
router.post('/:id/activate', activateContract);
router.post('/:id/terminate', terminateContract);

export default router;
