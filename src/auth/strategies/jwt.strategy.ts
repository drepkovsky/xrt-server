import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtConfig } from 'src/config/jwt.config';
import { JWT_CONFIG_KEY } from 'src/config/jwt.config';
import { UsersService } from 'src/users/users.service';
import type { JwtPayload } from '../types';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfig>(JWT_CONFIG_KEY).secret,
    });
  }

  /**
   * Must be called validate thus it is just transforming
   * the payload from and already validated JWT
   */
  async validate(payload: JwtPayload): Promise<User> {
    return this.userService.findOne(payload.sub);
  }
}
