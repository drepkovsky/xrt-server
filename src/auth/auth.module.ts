import { AuthController } from '#app/auth/auth.controller';
import { AuthService } from '#app/auth/auth.service';
import { JwtAuthGuard } from '#app/auth/guards/jwt-auth.guard';
import { JwtAuthIoGuard } from '#app/auth/guards/jwt-auth.ioguard';
import { LocalAuthGuard } from '#app/auth/guards/local-auth.guard';
import { JwtStrategy } from '#app/auth/strategies/jwt.strategy';
import { LocalStrategy } from '#app/auth/strategies/local.strategy';
import { ConfigKey } from '#app/config/config.types';
import { JwtConfig } from '#app/config/jwt.config';
import { UsersModule } from '#app/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<JwtConfig>(ConfigKey.JWT).secret,
        signOptions: {
          expiresIn: configService.get<JwtConfig>(ConfigKey.JWT).expiresIn,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    JwtAuthIoGuard,
    LocalAuthGuard,
  ],
})
export class AuthModule {}
