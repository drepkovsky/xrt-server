import { JwtPayload } from '#app/auth/auth.types';
import { ConfigKey } from '#app/config/config.types';
import { JwtConfig } from '#app/config/jwt.config';
import { User } from '#app/users/entities/user.entity';
import { UsersService } from '#app/users/users.service';
import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private userService: UsersService,
    private readonly orm: MikroORM,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfig>(ConfigKey.JWT).secret,
    });
  }

  /**
   * Must be called validate thus it is just transforming
   * the payload from and already validated JWT
   */
  async validate(payload: JwtPayload): Promise<User> {
    return this.userService.findOne(this.orm.em, { id: payload.sub });
  }
}
