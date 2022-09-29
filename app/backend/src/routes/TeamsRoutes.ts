import { Router } from 'express';

import TeamsController from '../controllers/TeamsController';

const router = Router();

router.get('/teams', TeamsController.getAll);
router.get('/teams/:id', TeamsController.getById);

export default router;
