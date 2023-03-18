import HttpException from '../exceptions/httpException';
import Team from '../database/models/Team.model';
import Match from '../database/models/Match.model';
import { ITeam, IGoals } from './interfaces/match.interfaces';

export default class MatchService {
  static async getAll(): Promise<Match[]> {
    const matches = await Match.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  }

  static async onQuery(query: string): Promise<Match[]> {
    const inProgress = query === 'true';
    const matches = await Match.findAll({ where: { inProgress },
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ] });
    return matches;
  }

  static async finishedM(id: number): Promise<string> {
    const [qtdUpdated] = await Match.update({ inProgress: false }, { where: { id } });
    if (qtdUpdated === 0) throw new HttpException(400, 'Match does not exist');
    return 'Finished';
  }

  static async create(data: ITeam): Promise<Match> {
    const { awayTeamId, homeTeamId } = data;
    const homeTeam = await Match.findByPk(homeTeamId);
    const awayTeam = await Match.findByPk(awayTeamId);
    if (!homeTeam || !awayTeam) {
      throw new HttpException(404, 'There is no team with such id!');
    }
    const result = await Match.create({ ...data, inProgress: true });
    return result;
  }

  static async updateScore(id:number, data: IGoals): Promise<IGoals> {
    const [qtdUpdated] = await Match.update({ ...data }, { where: { id } });
    if (qtdUpdated === 0) throw new HttpException(400, 'Match does not exist');

    return data;
  }
}
