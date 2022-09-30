import { Response, Request } from 'express';

import INTERNAL_ERROR from '../helpers/errorHelper';
import getMatchesService from '../services/matches/getMatches';

export default class MatchesController {
  static async getAll(req: Request, res: Response) {
    try {
      const { inProgress } = req.query;
      if (inProgress) {
        const { data, code } = await getMatchesService.getByInProgress(
          inProgress as string,
        );
        return res.status(code).json(data);
      }
      const { code, data } = await getMatchesService.getAll();
      return res.status(code).json(data);
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }
}
