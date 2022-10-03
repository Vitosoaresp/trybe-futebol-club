import * as sequelize from 'sequelize';
import TeamsModel from '../../database/models/TeamsModel';
import MatchesModel from '../../database/models/MatchesModel';
import { IMatch, IMatches } from '../../interfaces/IMatches';
import { ILeaderBoard } from '../../interfaces/ILeaderBoard';

export default class LeaderBoardHome {
  static async getHome() {
    const team = await TeamsModel.findAll({
      include: [{ model: MatchesModel, as: 'home', where: { inProgress: 0 } }],
    });
    const generateTable = team.map(this.generateTable);
    this.sortLeaderBoard(generateTable);
    return { code: 200, data: generateTable };
  }

  static generateTable({ teamName, home }: any) {
    const { goalsBalance, goalsFavor, goalsOwn } =
      LeaderBoardHome.sumGoals(home);
    const { totalDraws, totalLosses, totalPoints, totalVictories } =
      LeaderBoardHome.matchStatistics(home);
    const efficiency = Number(
      ((totalPoints / (home.length * 3)) * 100).toFixed(2),
    );
    return {
      name: teamName,
      totalPoints,
      totalGames: home.length,
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
      (acc, curr) => (acc += curr.homeTeamGoals),
      0,
    );
    const goalsOwn = matches.reduce(
      (acc, curr) => (acc += curr.awayTeamGoals),
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
      if (match.homeTeamGoals > match.awayTeamGoals) {
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
