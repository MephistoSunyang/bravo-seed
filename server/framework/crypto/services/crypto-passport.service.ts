import { Injectable } from '@nestjs/common';
import crypto from 'crypto-js';
import _ from 'lodash';

@Injectable()
export class CryptoPassportService {
  public ticketSecret = _.toString(process.env.PASSPORT_TICKET_SECRET);

  public encodeTicket(content: string): string {
    const cipher = crypto.AES.encrypt(content, this.ticketSecret);
    return cipher.toString().replace(/\+/g, '-').replace(/\//g, '_');
  }

  public decodeTicket(encodedTicket: string): string {
    const decipher = crypto.AES.decrypt(
      encodedTicket.replace(/\-/g, '+').replace(/\_/g, '/'),
      this.ticketSecret,
    );
    return decipher.toString(crypto.enc.Utf8);
  }
}
