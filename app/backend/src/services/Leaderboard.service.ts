import sorting from '../helpers/sort';
import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';
import SumHelper from '../helpers/help';
import { IDB, ILBFull, ILBData } from './interfaces/leaderboard.interface';

export default class LeaderboardService {
  static mapInfo(
    matchesByTeam: Match[][],
    teams: Team[],
    url:string,
  ): ILBFull[] {
    const sumHelper = new SumHelper(url);
    return matchesByTeam.map((team, index) => sumHelper.properties
      .reduce((acc, curr) => ({
        ...acc,
        name: teams[index].teamName,
        [curr]: sumHelper.calculate(team, curr),
      }), {} as ILBFull));
  }

  static takeInfo(url: string, teams: Team[], matches: Match[]): ILBFull[] {
    const homeOrAway = url.includes('home') ? 'homeTeamId' : 'awayTeamId';
    const matchesByTeam = teams.map((team) => matches.filter((m) => m[homeOrAway] === team.id));
    return LeaderboardService.mapInfo(matchesByTeam, teams, url);
  }

  static sumIt(home:ILBData[], away:ILBData[]): ILBData[] {
    const keys = (Object.keys(home[0]) as (keyof ILBData)[]);
    const totals = home
      .map((team, index) => keys
        .reduce((acc, curr) => ({
          ...acc,
          [curr]: team[curr] + away[index][curr],
        }), {} as ILBData));
    return totals;
  }

  static async takeDb(): Promise<IDB> {
    const teams = await Team.findAll();
    const matches = await Match.findAll({ where: { inProgress: false } });
    return { teams, matches };
  }

  static async getAll(url: string): Promise<ILBFull[]> {
    const { teams, matches } = await LeaderboardService.takeDb();
    const home = LeaderboardService.takeInfo('home', teams, matches);
    const away = LeaderboardService.takeInfo('away', teams, matches);
    if (url.includes('home')) {
      return sorting(home);
    }
    if (url.includes('away')) {
      return sorting(away);
    }
    const totals = LeaderboardService.sumIt(home, away);
    const data = totals.map((team, index) => ({
      ...team,
      name: home[index].name,
      goalsBalance: team.goalsFavor - team.goalsOwn,
      efficiency: ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2),
    }));
    return sorting(data);
  }
}
