import { Request, Response } from 'express';

import { IUserDTOLogin } from '../interfaces/IUserServices';
import UserServices from '../services/user/UserServices';
import TokenHelper from '../helpers/tokenHelper';
import { JwtPayload } from 'jsonwebtoken';

const INTERNAL_ERROR = {
  code: 500,
  message: 'Internal Error!',
};

export default class UserController {
  static tokenHelper = new TokenHelper();

  static async login(
    req: Request<unknown, unknown, IUserDTOLogin>,
    res: Response,
  ) {
    try {
      const { email, password } = req.body;
      const result = await UserServices.login(email, password);
      if (result !== true) {
        return res.status(result.code).json({ message: result.message });
      }
      const token = UserController.tokenHelper.createToken({ email });
      return res.status(201).json({ token });
    } catch (error) {
      console.log(error);
      res.status(INTERNAL_ERROR.code).json({ message: INTERNAL_ERROR.message });
    }
  }

  static async getTypeUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: 'Token not found' });
      }
      const getInfo = UserController.tokenHelper.verifyToken(
        token,
      ) as JwtPayload;
      const getUser = await UserServices.getUserByEmail(getInfo.email);
      res.status(200).json({ role: getUser.role });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}
