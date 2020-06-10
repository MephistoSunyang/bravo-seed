import { Injectable } from '@nestjs/common';
import crypto from 'crypto-js';

@Injectable()
export class CryptoUserService {
  public passwordSecret = String(process.env.SYSTEM_USER_PASSWORD_SECRET);

  public encodePassword(password: string): string {
    const cipher = crypto.AES.encrypt(password, this.passwordSecret);
    return cipher.toString();
  }

  public decodePassword(encodedPassword: string): string {
    const decipher = crypto.AES.decrypt(encodedPassword, this.passwordSecret);
    return decipher.toString(crypto.enc.Utf8);
  }
}
