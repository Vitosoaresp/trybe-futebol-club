import { Response, Request } from 'express';
import INTERNAL_ERROR from '../helpers/errorHelper';

import GetAllTeams from '../services/teams/getAllTeams';

export default class TeamsController {
  static async getAll(_req: Request, res: Response) {
    try {
      const { code, data } = await GetAllTeams.getTeams();
      return res.status(code).json(data);
    } catch (error) {
      console.log(error);
      return res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }
}
