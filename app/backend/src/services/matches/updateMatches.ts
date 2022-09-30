import Matches from '../../database/models/MatchesModel';

export default class updateMatches {
  static async update(id: string) {
    await Matches.update({ inProgress: false }, { where: { id } });
    return { code: 200, message: 'Finished' };
  }
}
