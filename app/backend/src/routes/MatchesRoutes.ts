import { Router } from 'express';

import MatchesController from '../controllers/MatchesController';
import Auth from '../middleware/authToken';

const router = Router();

router.get('/matches', MatchesController.getAll);
router.post('/matches', Auth.authToken, MatchesController.create);
router.patch('/matches/:id/finish', MatchesController.update);
router.patch('/matches/:id', MatchesController.updateGoals);

export default router;
