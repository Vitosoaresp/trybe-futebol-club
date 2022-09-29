import Teams from '../../database/models/TeamsModel';
import { ITeamsServicesReturn } from '../../interfaces/ITeamsServices';

export default class GetAllTeams {
  static async getTeams(): Promise<ITeamsServicesReturn> {
    const teams = await Teams.findAll();
    return { code: 200, data: teams };
  }
}
