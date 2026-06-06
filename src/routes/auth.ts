import { Router } from 'express';
import { showLogin, login, showRegister, register, logout } from '../controllers/authController';

const router = Router();

router.get('/login', showLogin);
router.post('/login', login);
router.get('/register', showRegister);
router.post('/register', register);
router.get('/logout', logout);

export default router;
