import * as Jwt from 'jsonwebtoken';
import * as Dotenv from 'dotenv';

Dotenv.config();

interface IPayload {
  email: string;
}

export default class TokenHelper {
  private static secret = process.env.JWT_SECRET as string;

  createToken(payload: IPayload): string {
    const token = Jwt.sign(payload, TokenHelper.secret);
    return token;
  }

  verifyToken = (token: string) => {
    const check = Jwt.verify(token, TokenHelper.secret);
    return check;
  };
}
