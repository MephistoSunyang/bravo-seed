import { getCurrentUserId, Logger } from '@bravo/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import _ from 'lodash';
import moment from 'moment';
import { CacheService } from '../../cache';
import { CryptoPassportService } from '../../crypto';
import { JWT_PAYLOAD_TYPE_ENUM } from '../enums';
import { IJwtPayload, ITicketCache, ITicketPayload, IToken } from '../interfaces';
import { RefreshTokenModel } from '../models';

@Injectable()
export class PassportJwtService {
  public tokenCacheExpiresIn = 30 * 24 * 60 * 60;
  public ticketCacheExpiresIn = 10 * 60;

  constructor(
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
    private readonly cryptoPassportService: CryptoPassportService,
  ) {}

  private getAccessTokenAndExpires(
    userId: number,
    type: JWT_PAYLOAD_TYPE_ENUM,
    sub: string,
  ): [string, number] {
    const accessToken = this.jwtService.sign({ userId, type, sub });
    const payload = this.jwtService.decode(accessToken) as IJwtPayload;
    const expiresIn = payload.exp * 1000;
    return [accessToken, expiresIn];
  }

  private getRefreshTokenAndRefreshTokenExpiresIn(): [string, number] {
    const expiresInDays = process.env.REFRESH_TOKEN_EXPIRES_IN
      ? _.toNumber(process.env.REFRESH_TOKEN_EXPIRES_IN)
      : 15;
    const refreshToken = crypto.randomBytes(16).toString('hex');
    const expiresIn = moment().add(expiresInDays, 'day').toDate().getTime();
    return [refreshToken, expiresIn];
  }

  private async getTicketPayload(ticket: string): Promise<ITicketPayload> {
    try {
      const cache = await this.cacheService.get<ITicketCache>('ticket', ticket);
      if (!cache) {
        throw new BadRequestException(`Not found ticket cache by ticket "${ticket}"!`);
      }
      if (cache.used) {
        await this.cacheService.remove('token', _.toString(cache.userId));
        throw new BadRequestException(`Ticket "${ticket}" have already been used!`);
      }
      const decodeTicket = this.cryptoPassportService.decodeTicket(ticket);
      const payload: ITicketPayload = JSON.parse(decodeTicket);
      const { userId, exp } = payload;
      if (Date.now() > exp) {
        throw new BadRequestException(`UserId "${userId}" ticket already expired!`);
      }
      return payload;
    } catch (error) {
      Logger.error(error, 'PassportJwtModule PassportJwtService Exception');
      throw new BadRequestException(`Invalid ticket "${ticket}"!`);
    }
  }

  public async generateTokenByUserId(
    userId: number,
    type: JWT_PAYLOAD_TYPE_ENUM,
    sub: string,
  ): Promise<IToken> {
    const [accessToken, accessTokenExpiresIn] = this.getAccessTokenAndExpires(userId, type, sub);
    const [refreshToken, refreshTokenExpiresIn] = this.getRefreshTokenAndRefreshTokenExpiresIn();
    const token: IToken = {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn,
    };
    await this.cacheService.set('token', _.toString(userId), token, this.tokenCacheExpiresIn);
    return token;
  }

  public async generateTokenByTicket(ticket: string): Promise<IToken> {
    const payload = await this.getTicketPayload(ticket);
    const { userId, type, sub } = payload;
    const token = await this.generateTokenByUserId(userId, type, sub);
    return token;
  }

  public async refreshToken(refreshTokenModel: RefreshTokenModel): Promise<IToken> {
    const { accessToken, refreshToken } = refreshTokenModel;
    const payload = this.jwtService.decode(accessToken) as IJwtPayload | null;
    if (!payload) {
      throw new BadRequestException(`Invalid accessToken "${accessToken}"!`);
    }
    const { userId, type, sub } = payload;
    const cache = await this.cacheService.get<IToken>('token', _.toString(userId));
    if (!cache) {
      throw new BadRequestException(`Invalid accessToken "${accessToken}"!`);
    }
    if (Date.now() < cache.accessTokenExpiresIn) {
      return cache;
    }
    if (refreshToken !== cache.refreshToken) {
      throw new BadRequestException(`Invalid refreshToken "${refreshToken}"!`);
    }
    if (Date.now() > cache.refreshTokenExpiresIn) {
      throw new BadRequestException(`UserId "${userId}" refreshToken expired!`);
    }
    const token = await this.generateTokenByUserId(userId, type, sub);
    return token;
  }

  public async deleteToken(): Promise<boolean> {
    try {
      const userId = getCurrentUserId();
      await this.cacheService.remove('token', _.toString(userId));
      return true;
    } catch (error) {
      Logger.error(error, 'PassportJwtModule PassportJwtService Exception');
      return false;
    }
  }

  public async getPayloadByAccessToken(accessToken: string): Promise<IJwtPayload> {
    const payload = this.jwtService.decode(accessToken) as IJwtPayload | null;
    if (!payload) {
      throw new BadRequestException(`Invalid accessToken "${accessToken}"!`);
    }
    const { userId } = payload;
    const cache = await this.cacheService.get<IToken>('token', _.toString(userId));
    if (!cache) {
      throw new BadRequestException(`Not found token cache by userId "${userId}"!`);
    }
    if (cache.accessToken !== accessToken) {
      throw new BadRequestException(`UserId "${userId}" accessToken invalid!`);
    }
    if (Date.now() > cache.accessTokenExpiresIn) {
      throw new BadRequestException(`UserId "${userId}" accessToken expired!`);
    }
    return payload;
  }

  public async generateTicket(
    userId: number,
    type: JWT_PAYLOAD_TYPE_ENUM,
    sub: string,
  ): Promise<string> {
    const expiresInSeconds = process.env.TICKET_EXPIRES_IN
      ? _.toNumber(process.env.TICKET_EXPIRES_IN)
      : 15;
    const expiresIn = moment().add(expiresInSeconds, 'second').toDate().getTime();
    const payload: ITicketPayload = {
      userId,
      type,
      sub,
      iat: Date.now(),
      exp: expiresIn,
    };
    const ticket = this.cryptoPassportService.encodeTicket(JSON.stringify(payload));
    const cache: ITicketCache = {
      userId,
      ticket,
      used: false,
    };
    await this.cacheService.set('ticket', ticket, cache, this.ticketCacheExpiresIn);
    return ticket;
  }
}
