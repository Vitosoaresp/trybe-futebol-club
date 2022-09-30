import { Response, Request } from 'express';

import INTERNAL_ERROR from '../helpers/errorHelper';
import getMatchesService from '../services/matches/getMatches';
import createMatchesService from '../services/matches/createMatches';
import { IMatchesDTO } from '../interfaces/IMatches';

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
  static async create(
    req: Request<unknown, unknown, IMatchesDTO>,
    res: Response,
  ) {
    try {
      const { awayTeam, awayTeamGoals, homeTeam, homeTeamGoals, inProgress } =
        req.body;
      const { code, data, message } = await createMatchesService.create({
        awayTeam,
        awayTeamGoals,
        homeTeam,
        homeTeamGoals,
        inProgress,
      });
      if (message) {
        return res.status(code).json(message);
      }
      return res.status(code).json(data);
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }
}
