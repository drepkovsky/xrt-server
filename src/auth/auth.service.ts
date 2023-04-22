/*
https://docs.nestjs.com/providers#services
*/

import type { JwtPayload } from '#app/auth/auth.types';
import type { User } from '#app/users/entities/user.entity';
import { UsersService } from '#app/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login(user: User) {
    const payload: JwtPayload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
