export interface IGoals {
  homeTeamGoals: number,
  awayTeamGoals: number,
}

export interface ITeam extends IGoals {
  homeTeamId: number,
  awayTeamId: number,
}
