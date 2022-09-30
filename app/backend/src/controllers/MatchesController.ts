import { Response, Request } from 'express';

import getMatchesService from '../services/matches/getMatches';
import createMatchesService from '../services/matches/createMatches';
import updateMatches from '../services/matches/updateMatches';

import INTERNAL_ERROR from '../helpers/errorHelper';
import { IMatchesDTO, IMatchesUpdateGoals } from '../interfaces/IMatches';

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
      const { code, data, message } = await createMatchesService.create(
        req.body,
      );
      if (message) return res.status(code).json({ message });
      return res.status(code).json(data);
    } catch (error) {
      res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { code, message } = await updateMatches.finished(id);
      return res.status(code).json({ message });
    } catch (error) {
      res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }

  static async updateGoals(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { awayTeamGoals, homeTeamGoals } = req.body as IMatchesUpdateGoals;
      const { code, message } = await updateMatches.changeGoals(
        id,
        homeTeamGoals,
        awayTeamGoals,
      );
      return res.status(code).json({ message });
    } catch (error) {
      res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }
}
