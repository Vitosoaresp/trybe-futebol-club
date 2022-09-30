import GetTeams from '../teams/getTeams';

const verifyExistingTeam = async (id: number): Promise<boolean> => {
  const { data } = await GetTeams.getByPK(id.toString());
  if (!data) return false;
  return true;
};

const checkIfTheTeamsAreDiferent = (
  homeTeam: number,
  awayTeam: number,
): boolean => {
  if (homeTeam === awayTeam) return false;
  return true;
};

export { checkIfTheTeamsAreDiferent, verifyExistingTeam };
