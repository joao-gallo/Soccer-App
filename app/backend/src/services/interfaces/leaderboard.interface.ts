import Match from '../../database/models/Match.model';
import Team from '../../database/models/Team.model';

export interface ILBData {
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}

export interface ILBMissing extends ILBData {
  name: string;

}

export interface ILBFull extends ILBMissing {
  goalsBalance: number;
  efficiency: string;
}

export interface IDB {
  teams: Team[],
  matches: Match[],
}
