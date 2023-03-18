import HttpException from '../exceptions/httpException';
import Team from '../database/models/Team.model';

export default class TeamService {
  static async getAll(): Promise<Team[]> {
    const teams = await Team.findAll();
    return teams;
  }

  static async getById(id: number): Promise<Team> {
    const team = await Team.findByPk(id);
    if (!team) throw new HttpException(400, 'Team not found');
    return team;
  }
}
