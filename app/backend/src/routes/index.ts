import { Router } from 'express';
import UserRouter from './User.route';
import TeamRouter from './Team.route';
import MatchRouter from './Match.route';
import LeaderboardRouter from './Leaderboard.route';

export default class AllRoutes {
  public router: Router;
  public userRouter : UserRouter;
  public teamRouter : TeamRouter;
  public matchRouter : MatchRouter;
  public leaderboardRouter : LeaderboardRouter;
  constructor() {
    this.router = Router();
    this.userRouter = new UserRouter();
    this.teamRouter = new TeamRouter();
    this.matchRouter = new MatchRouter();
    this.leaderboardRouter = new LeaderboardRouter();

    this.router.use('/login', this.userRouter.router);
    this.router.use('/teams', this.teamRouter.router);
    this.router.use('/matches', this.matchRouter.router);
    this.router.use('/leaderboard', this.leaderboardRouter.router);
  }
}
