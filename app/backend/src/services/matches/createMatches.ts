import Matches from '../../database/models/MatchesModel';
import { IMatchesDTO, IMatchesReturn } from '../../interfaces/IMatches';
import {
  checkIfTheTeamsAreDiferent,
  verifyExistingTeam,
} from '../dtos/MatchesDTO';

export default class createMatches {
  static async create(props: IMatchesDTO): Promise<IMatchesReturn> {
    if (!checkIfTheTeamsAreDiferent(props.homeTeam, props.awayTeam)) {
      return {
        code: 401,
        message: 'It is not possible to create a match with two equal teams',
      };
    }
    const isTeamHomeExisting = await verifyExistingTeam(props.homeTeam);
    const isTeamAwayExisting = await verifyExistingTeam(props.awayTeam);
    if (!isTeamHomeExisting || !isTeamAwayExisting) {
      return { code: 404, message: 'There is no team with such id!' };
    }
    const newMatche = await Matches.create(props);
    return { code: 201, data: newMatche };
  }
}
