import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class PassportSerializerService extends PassportSerializer {
  public serializeUser(user: any, done: Function): void {
    done(null, user);
  }

  public deserializeUser(payload: any, done: Function): void {
    done(null, payload);
  }
}
