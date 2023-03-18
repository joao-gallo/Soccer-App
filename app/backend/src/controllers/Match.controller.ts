import { Request, Response } from 'express';
import MatchService from '../services/match.service';

export default class MatchController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    if (req.query.inProgress) return MatchController.onQuery(req, res);
    const matches = await MatchService.getAll();
    return res.status(200).json(matches);
  }

  static async onQuery(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    const matches = await MatchService.onQuery(inProgress as string);
    return res.status(200).json(matches);
  }

  static async finishedM(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const message = await MatchService.finishedM(+id);
    return res.status(200).json({ message });
  }

  static async create(req: Request, res: Response): Promise<Response> {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const data = {
      homeTeamId: +homeTeamId,
      awayTeamId: +awayTeamId,
      homeTeamGoals: +homeTeamGoals,
      awayTeamGoals: +awayTeamGoals,
    };
    const newMatch = await MatchService.create(data);
    return res.status(201).json(newMatch);
  }

  static async updateScore(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = await MatchService.updateScore(+id, req.body);
    return res.status(200).json(data);
  }
}
