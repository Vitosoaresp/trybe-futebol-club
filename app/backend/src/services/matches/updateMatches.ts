import Matches from '../../database/models/MatchesModel';

export default class updateMatches {
  static async finished(id: string) {
    await Matches.update({ inProgress: false }, { where: { id } });
    return { code: 200, message: 'Finished' };
  }

  static async changeGoals(id: string, homeGoals: string, awayGoals: string) {
    await Matches.update(
      { homeTeamGoals: homeGoals, awayTeamGoals: awayGoals },
      { where: { id } },
    );
    return { code: 200, message: 'Updated goals' };
  }
}
