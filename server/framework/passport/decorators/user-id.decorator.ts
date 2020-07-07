import { getCurrentUserId, IRequest } from '@bravo/core';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const UserId = createParamDecorator((params: any, request: IRequest) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new UnauthorizedException('Not found userId by user decorator!');
  }
  return userId;
});
