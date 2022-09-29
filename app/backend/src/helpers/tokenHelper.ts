import * as Jwt from 'jsonwebtoken';
import * as Dotenv from 'dotenv';

Dotenv.config();

interface IPayload {
  email: string;
}

export default class TokenHelper {
  private static secret = process.env.JWT_SECRET;

  createToken(payload: IPayload): string {
    if (TokenHelper.secret) {
      const token = Jwt.sign(payload, TokenHelper.secret);
      return token;
    }
    throw new Error('Não foi possivel ler a secret');
  }

  verifyToken = (token: string) => {
    if (TokenHelper.secret) {
      const check = Jwt.verify(token, TokenHelper.secret);
      return check;
    }
    throw new Error('Não foi possivel ler a secret');
  };
}
