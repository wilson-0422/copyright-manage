import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { showDashboard } from '../controllers/dashboardController';
import { listRevenues, settleRevenue, createRevenue } from '../controllers/revenueController';
import authRoutes from './auth';
import workRoutes from './works';
import copyrightRoutes from './copyrights';
import contractRoutes from './contracts';

const router = Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('index');
  }
});

router.get('/dashboard', requireAuth, showDashboard);

router.use('/auth', authRoutes);
router.use('/works', requireAuth, workRoutes);
router.use('/copyrights', requireAuth, copyrightRoutes);
router.use('/contracts', requireAuth, contractRoutes);

router.get('/revenues', requireAuth, listRevenues);
router.post('/revenues', requireAuth, createRevenue);
router.post('/revenues/:id/settle', requireAuth, settleRevenue);

export default router;
