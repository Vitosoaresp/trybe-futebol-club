import { validateLogin } from '../dtos/UserDTO';
import User from '../../database/models/UserModel';
import BcryptService from '../utils/BcriptServices';

export default class UserServices {
  static async login(email: string, password: string) {
    const getUser = await User.findAll({
      where: { email },
    });
    console.log(getUser);
    if (getUser.length < 1 || !getUser) {
      return { code: 404, message: 'User not found!' };
    }
    const isValidDTO = validateLogin(email, password);
    if (!isValidDTO) {
      return { code: 401, message: 'Incorrect email or password' };
    }
    const checkPass = BcryptService.compare(getUser[0].password, password);
    if (!checkPass) {
      return { code: 401, message: 'Incorrect email or password' };
    }
    return true;
  }
}
