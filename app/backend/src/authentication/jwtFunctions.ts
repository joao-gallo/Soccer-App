import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { tokenUser } from './interfaces/jwt.interface';

dotenv.config();

const secret = process.env.JWT_SECRET || 'seuSegredoAqui';

const createToken = (userWithoutPassword: tokenUser) => {
  const token = jwt.sign({ data: userWithoutPassword }, secret, {
    algorithm: 'HS256',
    expiresIn: '1d',
  });
  return token;
};

const verifyToken = (authorization: string) => {
  try {
    const payload = jwt.verify(authorization, secret);
    return payload;
  } catch (error) {
    return { isError: true };
  }
};

export { createToken, verifyToken };
