import TeamsModel from '../../database/models/TeamsModel';
import MatchesModel from '../../database/models/MatchesModel';
import { IMatch, IMatches } from '../../interfaces/IMatches';
import { ILeaderBoard } from '../../interfaces/ILeaderBoard';

export default class LeaderBoardAway {
  static async getAway() {
    const team = await TeamsModel.findAll({
      include: [{ model: MatchesModel, as: 'away', where: { inProgress: 0 } }],
    });
    const generateTable = team.map(this.generateTable);
    this.sortLeaderBoard(generateTable);
    return { code: 200, data: generateTable };
  }

  static generateTable({ teamName, away }: any): ILeaderBoard {
    const { goalsBalance, goalsFavor, goalsOwn } =
      LeaderBoardAway.sumGoals(away);
    const { totalDraws, totalLosses, totalPoints, totalVictories } =
      LeaderBoardAway.matchStatistics(away);
    const efficiency = Number(
      ((totalPoints / (away.length * 3)) * 100).toFixed(2),
    );
    return {
      name: teamName,
      totalPoints,
      totalGames: away.length,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  }

  static sortLeaderBoard(leaderBoard: ILeaderBoard[]) {
    leaderBoard.sort((a, b) => {
      if (a.totalPoints < b.totalPoints) {
        return 1;
      }
      if (a.totalPoints > b.totalPoints) {
        return -1;
      }
      if (a.totalVictories < b.totalVictories) {
        return 1;
      }
      if (a.totalVictories > b.totalVictories) {
        return -1;
      }
      if (a.goalsBalance < b.goalsBalance) {
        return 1;
      }
      if (a.goalsBalance > b.goalsBalance) {
        return -1;
      }
      if (a.goalsFavor < b.goalsFavor) {
        return 1;
      }
      if (a.goalsFavor > b.goalsFavor) {
        return -1;
      }
      if (a.goalsOwn < b.goalsOwn) {
        return 1;
      }
      if (a.goalsOwn > b.goalsOwn) {
        return -1;
      }
      return 0;
    });
  }

  static sumGoals(matches: IMatch[]) {
    const goalsFavor = matches.reduce(
      (acc, curr) => (acc += curr.awayTeamGoals),
      0,
    );
    const goalsOwn = matches.reduce(
      (acc, curr) => (acc += curr.homeTeamGoals),
      0,
    );
    const goalsBalance = goalsFavor - goalsOwn;
    return { goalsBalance, goalsFavor, goalsOwn };
  }

  static matchStatistics(matches: IMatches[]) {
    let totalVictories = 0;
    let totalPoints = 0;
    let totalDraws = 0;
    let totalLosses = 0;
    matches.forEach((match) => {
      if (match.homeTeamGoals < match.awayTeamGoals) {
        totalVictories += 1;
        totalPoints += 3;
      } else if (match.homeTeamGoals === match.awayTeamGoals) {
        totalDraws += 1;
        totalPoints += 1;
      } else {
        totalLosses += 1;
      }
    });
    return { totalPoints, totalVictories, totalDraws, totalLosses };
  }
}
