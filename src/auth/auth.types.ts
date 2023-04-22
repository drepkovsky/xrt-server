import type { User } from '#app/users/entities/user.entity';

export type JwtPayload = {
  sub: User['id'];
};

export type AuthPayload = {
  accessToken: string;
};
