import * as bcrypt from 'bcryptjs';
import HttpException from '../exceptions/httpException';
import User from '../database/models/User.model';
import { Login } from './interfaces/user.interfaces';
import { createToken } from '../authentication/jwtFunctions';

export default class UserService {
  static async login(data: Login): Promise<string> {
    const { email, password } = data;

    const findUser = await User.findOne({ where: { email } });

    if (!findUser) {
      throw new HttpException(401, 'Incorrect email or password');
    }

    const checkPassword = bcrypt.compareSync(password, findUser.dataValues.password);
    if (!checkPassword) {
      throw new HttpException(401, 'Incorrect email or password');
    }
    const { password: _pass, ...userWithoutPassword } = findUser.dataValues;
    const token = createToken(userWithoutPassword);
    return token;
  }
}
