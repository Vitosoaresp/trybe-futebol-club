import { Router } from 'express';

import MatchesController from '../controllers/MatchesController';

const router = Router();

router.get('/matches', MatchesController.getAll);

export default router;
