import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

export type AuthenticatedRequest = Request & { user: JwtPayload };

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  return (ctx.switchToHttp().getRequest<AuthenticatedRequest>()).user;
});
