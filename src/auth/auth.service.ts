/*
https://docs.nestjs.com/providers#services
*/

import { JwtPayload } from '#app/auth/types';
import { User } from '#app/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: User) {
    const payload: JwtPayload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
