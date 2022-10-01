import { Request, Response } from 'express';
import GetLeaderBoard from '../services/leaderboard/getHome';
import INTERNAL_ERROR from '../helpers/errorHelper';

export default class LeaderBoardController {
  static async home(_req: Request, res: Response) {
    try {
      const { code, data } = await GetLeaderBoard.getHome();
      res.status(code).json(data);
    } catch (error) {
      res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }
}
