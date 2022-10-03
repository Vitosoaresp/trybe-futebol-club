import { Router } from 'express';
import LeaderBoardController from '../controllers/LeaderBoardController';

const router = Router();

router.get('/leaderboard/home', LeaderBoardController.home);
router.get('/leaderboard/away', LeaderBoardController.away);
router.get('/leaderboard', LeaderBoardController.leaderBoard);

export default router;
