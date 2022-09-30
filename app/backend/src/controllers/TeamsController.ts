import { Response, Request } from 'express';

import GetTeamsService from '../services/teams/getTeams';

import INTERNAL_ERROR from '../helpers/errorHelper';

export default class TeamsController {
  static async getAll(_req: Request, res: Response) {
    try {
      const { code, data } = await GetTeamsService.getAll();
      return res.status(code).json(data);
    } catch (error) {
      console.log(error);
      return res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, code } = await GetTeamsService.getByPK(id);
      if (!data) return res.status(code).json([]);
      return res.status(code).json(data);
    } catch (error) {
      console.log(error);
      return res.status(INTERNAL_ERROR.code).json(INTERNAL_ERROR.message);
    }
  }
}
