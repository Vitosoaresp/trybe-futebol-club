import Teams from '../../database/models/TeamsModel';
import { ITeamsServicesReturn } from '../../interfaces/ITeamsServices';

export default class GetTeams {
  static async getAll(): Promise<ITeamsServicesReturn> {
    const teams = await Teams.findAll();
    return { code: 200, data: teams };
  }
  static async getByPK(id: string): Promise<ITeamsServicesReturn> {
    const team = await Teams.findByPk(id);
    if (!team) {
      return { code: 200, data: [] };
    }
    return { code: 200, data: team };
  }
}
