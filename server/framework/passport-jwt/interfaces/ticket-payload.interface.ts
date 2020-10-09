import { JWT_PAYLOAD_TYPE_ENUM } from '../enums';

export interface ITicketPayload {
  userId: number;
  type: JWT_PAYLOAD_TYPE_ENUM;
  sub: string;
  iat: number;
  exp: number;
}
