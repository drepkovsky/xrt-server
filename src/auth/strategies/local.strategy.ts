import type { User } from '#app/users/entities/user.entity';
import { UsersService } from '#app/users/users.service';
import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private readonly orm: MikroORM,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.userService.validateUser(this.orm.em, email, password);
  }
}
