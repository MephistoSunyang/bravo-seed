import { Injectable } from '@nestjs/common';
import crypto from 'crypto-js';
import _ from 'lodash';

@Injectable()
export class CryptoConfigService {
  public contentSecret = _.toString(process.env.SYSTEM_CONFIG_CONTENT_SECRET);

  public encodeContent(content: string): string {
    const cipher = crypto.AES.encrypt(content, this.contentSecret);
    return cipher.toString();
  }

  public decodeContent(encodedContent: string): string {
    const decipher = crypto.AES.decrypt(encodedContent, this.contentSecret);
    return decipher.toString(crypto.enc.Utf8);
  }
}
