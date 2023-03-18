import { Request, Response } from 'express';
import TeamService from '../services/Team.service';

export default class TeamController {
  static async getAll(_req: Request, res: Response): Promise<Response> {
    const teams = await TeamService.getAll();
    return res.status(200).json(teams);
  }

  static async getById(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const team = await TeamService.getById(+id);
    return res.status(200).json(team);
  }
}
