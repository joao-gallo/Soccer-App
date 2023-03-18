import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.service';

export default class LeaderboardController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    const result = await LeaderboardService.getAll(req.originalUrl);

    return res.status(200).json(result);
  }
}
