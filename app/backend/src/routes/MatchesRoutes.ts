import { Router } from 'express';

import MatchesController from '../controllers/MatchesController';
import Auth from '../middleware/authToken';

const router = Router();

router.get('/matches', MatchesController.getAll);
router.post('/matches', Auth.authToken, MatchesController.create);

export default router;
