import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/login', UserController.login);
router.get('/login/validate', UserController.getTypeUser);

export default router;
