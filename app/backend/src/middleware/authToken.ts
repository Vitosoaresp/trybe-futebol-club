import { NextFunction, Request, Response } from 'express';

import TokenHelper from '../helpers/tokenHelper';

export default class Auth {
  static tokenHelper = new TokenHelper();

  static async authToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: 'Token must be a valid token' });
      }
      Auth.tokenHelper.verifyToken(token);
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Token must be a valid token' });
    }
  }
}
