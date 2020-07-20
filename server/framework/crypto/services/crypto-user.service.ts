import { Injectable } from '@nestjs/common';
import crypto from 'crypto-js';
import _ from 'lodash';

@Injectable()
export class CryptoUserService {
  public passwordSecret = _.toString(process.env.SYSTEM_USER_PASSWORD_SECRET);

  public encodePassword(password: string): string {
    const keyBuffer = crypto.enc.Utf8.parse(this.passwordSecret);
    const cipher = crypto.AES.encrypt(password, keyBuffer, {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7,
      iv: '',
    });
    return crypto.enc.Base64.stringify(cipher.ciphertext).toString();
  }

  public decodePassword(encodedPassword: string): string {
    const keyBuffer = crypto.enc.Utf8.parse(this.passwordSecret);
    const decipher = crypto.AES.decrypt(encodedPassword, keyBuffer, {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7,
      iv: '',
    });
    const resultDecipher = crypto.enc.Utf8.stringify(decipher);
    return JSON.parse(resultDecipher);
  }
}
