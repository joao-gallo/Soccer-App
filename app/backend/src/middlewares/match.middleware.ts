import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/httpException';

export default (req: Request, res: Response, next: NextFunction) => {
  const { homeTeamId, awayTeamId } = req.body;
  if (+homeTeamId === +awayTeamId) {
    throw new HttpException(422, 'It is not possible to create a match with two equal teams');
  }
  next();
};
