import { BusinessException, Logger } from '@bravo/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DecodeOptions, SignOptions, VerifyOptions } from 'jsonwebtoken';
import _ from 'lodash';
import { CryptoPassportService } from '../../crypto';

@Injectable()
export class PassportService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoPassportService: CryptoPassportService,
  ) {}

  private getUserIdByTicket(encodedTicket: string): number {
    try {
      const contentStringify = this.cryptoPassportService.decodeTicket(encodedTicket);
      const { timestamp, userId }: { timestamp: number; userId: number } = JSON.parse(
        contentStringify,
      );
      const ticketExpires = _.toNumber(process.env.TICKET_EXPIRES);
      if (new Date().getTime() - timestamp > ticketExpires) {
        Logger.warn(`UserId "${userId}" ticket already expired!`, 'PassportModule PassportService');
        throw new BusinessException(`Ticket already expired!`, 'ticket已超时，请重新登录');
      }
      return userId;
    } catch (error) {
      Logger.error(error, 'PassportModule PassportService');
      throw new BadRequestException(`Invalid ticket!`);
    }
  }

  public jwtSign(payload: string | Buffer | object, options?: SignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  public jwtVerify<IPayload extends object = any>(
    token: string,
    options?: VerifyOptions,
  ): IPayload {
    return this.jwtService.verify(token, options);
  }

  public jwtDecode<IPayload = any>(token: string, options?: DecodeOptions): IPayload | null {
    return this.jwtService.decode(token, options) as any;
  }

  public getAccessTokenByTicket(ticket: string): string {
    const userId = this.getUserIdByTicket(ticket);
    const accessToken = this.getAccessTokenByUserId(userId);
    return accessToken;
  }

  public getAccessTokenByUserId(userId: number): string {
    if (!_.isNumber(userId)) {
      throw new BadRequestException(`Invalid userId "${userId}"!`);
    }
    const token = this.jwtSign({ userId });
    return token;
  }

  public getUserIdByAccessToken(accessToken: string): number | null {
    const payload = this.jwtDecode(accessToken);
    return payload && payload.userId ? _.toNumber(payload.userId) : null;
  }

  public generateTicketByUserId(userId: number): string {
    if (!_.isNumber(userId)) {
      throw new BadRequestException(`Invalid userId "${userId}"!`);
    }
    const timestamp = new Date().getTime();
    const content = JSON.stringify({ timestamp, userId });
    const ticket = this.cryptoPassportService.encodeTicket(content);
    return ticket;
  }
}
