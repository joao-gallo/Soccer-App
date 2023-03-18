import { ErrorRequestHandler } from 'express';
import HttpException from '../exceptions/httpException';

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const { status, message } = err as HttpException;
  res.status(status || 500).json({ message });
};

export default errorMiddleware;
