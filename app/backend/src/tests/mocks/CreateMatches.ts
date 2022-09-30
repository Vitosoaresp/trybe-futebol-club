import { IMatchesDTO } from '../../interfaces/IMatches';

interface IMatchesMock extends IMatchesDTO {
  id: number;
}

const newMatchesDTO: IMatchesDTO = {
  homeTeam: 1,
  homeTeamGoals: 3,
  awayTeam: 2,
  awayTeamGoals: 2,
  inProgress: true,
};

const newMatchesInProgressMock: IMatchesMock = {
  id: 1,
  homeTeam: 1,
  homeTeamGoals: 3,
  awayTeam: 2,
  awayTeamGoals: 2,
  inProgress: true,
};

const newMatchesFinishedMock: IMatchesMock = {
  id: 1,
  homeTeam: 16,
  homeTeamGoals: 2,
  awayTeam: 8,
  awayTeamGoals: 2,
  inProgress: false,
};

export { newMatchesInProgressMock, newMatchesFinishedMock, newMatchesDTO };
