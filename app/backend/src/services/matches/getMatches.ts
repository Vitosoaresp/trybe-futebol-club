import Teams from '../../database/models/TeamsModel';
import Matches from '../../database/models/MatchesModel';
import { IMatchesReturn } from '../../interfaces/IMatches';

export default class getMatches {
  static async getAll(): Promise<IMatchesReturn> {
    const matches = await Matches.findAll({
      include: [
        {
          model: Teams,
          as: 'teamHome',
          attributes: ['teamName'],
        },
        {
          model: Teams,
          as: 'teamAway',
          attributes: ['teamName'],
        },
      ],
    });
    return { code: 200, data: matches };
  }
}
