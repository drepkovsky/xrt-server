import { User } from '@prisma/client';

export type JwtPayload = {
  sub: User['id'];
};
