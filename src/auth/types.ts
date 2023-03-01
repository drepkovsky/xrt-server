import { User } from '#app/users/entities/user.entity';

export type JwtPayload = {
  sub: User['id'];
};
