import { Response, Request } from 'express';

import TeamsByPK from '../services/teams/getByPKTeams';
import GetAllTeams from '../services/teams/getAllTeams';

import INTERNAL_ERROR from '../helpers/errorHelper';

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

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, code } = await TeamsByPK.getTeamsByPK(id);
      return res.status(code).json(data);
    } catch (error) {
      console.log(error);
      return res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }
}
