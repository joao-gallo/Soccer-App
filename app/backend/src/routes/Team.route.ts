import { Router } from 'express';
import TeamController from '../controllers/Team.controller';

export default class TeamRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/', TeamController.getAll);
    this.router.get('/:id', TeamController.getById);
  }
}
