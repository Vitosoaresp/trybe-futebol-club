import Teams from '../../database/models/TeamsModel';
import {
  ITeamsServices,
  ITeamsServicesReturn,
} from '../../interfaces/ITeamsServices';

export default class TeamsByPK {
  static async getTeamsByPK(id: string): Promise<ITeamsServicesReturn> {
    const team = await Teams.findByPk(id);
    if (!team) {
      return { code: 200, data: [] };
    }
    return { code: 200, data: team };
  }
}
