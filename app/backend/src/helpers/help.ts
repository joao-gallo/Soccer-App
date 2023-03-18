import Match from '../database/models/Match.model';
import { IHomeOrOut, IProperties } from './types';
import { ISummer } from './summer.interface';

export default class ISummerClass implements ISummer {
  private _homeOrOut: IHomeOrOut;
  private _out: IHomeOrOut;
  private _properties: IProperties[];

  constructor(url: string) {
    this._homeOrOut = url.includes('home') ? 'homeTeamGoals' : 'awayTeamGoals';
    this._out = url.includes('home') ? 'awayTeamGoals' : 'homeTeamGoals';
    this._properties = ['totalPoints', 'totalGames', 'totalVictories', 'totalDraws',
      'totalLosses', 'goalsFavor', 'goalsOwn', 'goalsBalance', 'efficiency'];
  }

  get homeOrOut() { return this._homeOrOut; }
  get out() { return this._out; }
  get properties() { return this._properties; }

  private totalPoints(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => {
      if (curr[this.homeOrOut] > curr[this.out]) return acc + 3;
      if (curr[this.homeOrOut] === curr[this.out]) return acc + 1;
      return acc;
    }, 0);
  }

  private totalVictories(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => {
      if (curr[this.homeOrOut] > curr[this.out]) return acc + 1;
      return acc;
    }, 0);
  }

  private totalLosses(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => {
      if (curr[this.homeOrOut] < curr[this.out]) return acc + 1;
      return acc;
    }, 0);
  }

  private totalDraws(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => {
      if (curr[this.homeOrOut] === curr[this.out]) return acc + 1;
      return acc;
    }, 0);
  }

  private goalsFavor(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => acc + curr[this.homeOrOut], 0);
  }

  private goalsOwn(teamMatches: Match[]): number {
    return teamMatches.reduce((acc: number, curr: Match): number => acc + curr[this.out], 0);
  }

  private goalsBalance(teamMatches:Match[]): number {
    return this.goalsFavor(teamMatches) - this.goalsOwn(teamMatches);
  }

  private efficiency(teamMatches:Match[]): string {
    return ((this.totalPoints(teamMatches) / (teamMatches.length * 3)) * 100).toFixed(2);
  }

  private totalGames = (teamMatches: Match[]): number => teamMatches.length;

  calculate(teamMatches: Match[], propertie: IProperties): number | string {
    return this[propertie](teamMatches);
  }
}
