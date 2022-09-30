import { validateLogin } from '../dtos/UserDTO';
import User from '../../database/models/UserModel';
import BcryptService from '../utils/BcriptServices';

export default class UserServices {
  static async login(email: string, password: string) {
    if (!email || !password) {
      return { code: 400, message: 'All fields must be filled' };
    }
    const isValidDTO = validateLogin(email, password);
    const getUser = await User.findAll({
      where: { email },
    });
    if (!isValidDTO || getUser.length < 1) {
      return { code: 401, message: 'Incorrect email or password' };
    }
    const checkPass = BcryptService.compare(getUser[0].password, password);
    if (!checkPass) {
      return { code: 401, message: 'Incorrect email or password' };
    }
    return { code: 200, data: true };
  }

  static async getUserByEmail(email: string) {
    const user = await User.findAll({
      where: { email },
    });
    return user[0];
  }
}
