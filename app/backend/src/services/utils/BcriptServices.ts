import * as bcrypt from 'bcryptjs';

export default class BcryptService {
  private static salt = 10;

  public static encrypt(pass: string): string {
    return bcrypt.hashSync(pass, this.salt);
  }

  public static compare(encryptText: string, planText: string): boolean {
    return bcrypt.compareSync(planText, encryptText);
  }
}
