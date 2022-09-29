export interface ITeamsServices {
  id: number;
  teamName: string;
}

export interface ITeamsServicesReturn {
  code: number;
  message?: string;
  data?: ITeamsServices[] | ITeamsServices;
}
