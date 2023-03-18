import Match from '../database/models/Match.model';
import { IHomeOrOut, IProperties } from './types';

export interface ISummer {
  homeOrOut: IHomeOrOut;
  out: IHomeOrOut;
  properties: IProperties[];
  calculate(teamMatches: Match[], propertie: IProperties): string | number;
}
