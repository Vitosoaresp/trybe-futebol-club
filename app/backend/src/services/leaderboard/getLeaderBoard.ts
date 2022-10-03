import LeaderBoardHome from './getHome';
import LeaderBoardAway from './getAway';
import { ILeaderBoard } from '../../interfaces/ILeaderBoard';

export default class LeaderBoard {
  static async getLeaderBoard() {
    const total = await LeaderBoard.sumTotal();
    LeaderBoard.sortLeaderBoard(total);
    return { code: 200, data: total };
  }

  static async sumTotal(): Promise<ILeaderBoard[]> {
    const { data: matchesHome } = await LeaderBoardHome.getHome();
    const { data: matchesAway } = await LeaderBoardAway.getAway();
    const result: ILeaderBoard[] = [];
    matchesHome.forEach((matchHome: ILeaderBoard) => {
      const awayGames = matchesAway.find(
        (matchAway) => matchHome.name === matchAway.name,
      ) as ILeaderBoard;
      const totalPoints = matchHome.totalPoints + awayGames.totalPoints;
      const totalGames = matchHome.totalGames + awayGames.totalGames;
      result.push({
        name: matchHome.name,
        totalPoints,
        totalGames,
        totalDraws: matchHome.totalDraws + awayGames.totalDraws,
        goalsBalance: matchHome.goalsBalance + awayGames.goalsBalance,
        goalsFavor: matchHome.goalsFavor + awayGames.goalsFavor,
        goalsOwn: matchHome.goalsOwn + awayGames.goalsOwn,
        totalLosses: matchHome.totalLosses + awayGames.totalLosses,
        totalVictories: matchHome.totalVictories + awayGames.totalVictories,
        efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)),
      });
    });
    return result;
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
}
