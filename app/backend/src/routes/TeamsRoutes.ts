import { Router } from 'express';

import TeamsController from '../controllers/TeamsController';

const router = Router();

router.get('/teams', TeamsController.getAll);

export default router;
