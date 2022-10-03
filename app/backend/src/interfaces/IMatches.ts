export interface IMatch {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}
export interface IMatches extends IMatch {
  id: number;
  teamHome?: {
    teamName: string;
  };
  teamAway?: {
    teamName: string;
  };
}

export interface IMatchesReturn {
  code: number;
  message?: string;
  data?: IMatches[] | IMatches;
}

export interface IMatchesDTO {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export interface IMatchesUpdateGoals {
  homeTeamGoals: string;
  awayTeamGoals: string;
}
