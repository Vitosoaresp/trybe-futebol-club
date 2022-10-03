import { Request, Response } from 'express';
import LeaderBoardHome from '../services/leaderboard/getHome';
import LeaderBoardAway from '../services/leaderboard/getAway';
import INTERNAL_ERROR from '../helpers/errorHelper';

export default class LeaderBoardController {
  static async home(_req: Request, res: Response) {
    try {
      const { code, data } = await LeaderBoardHome.getHome();
      res.status(code).json(data);
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }

  static async away(_req: Request, res: Response) {
    try {
      const { code, data } = await LeaderBoardAway.getAway();
      res.status(code).json(data);
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }
}
