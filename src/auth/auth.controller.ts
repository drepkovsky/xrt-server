import { AuthService } from '#app/auth/auth.service';
import type { AuthPayload } from '#app/auth/auth.types';
import { UserParam } from '#app/auth/decorators/user-param.decorator';
import { RegisterDto } from '#app/auth/dto/auth.dto';
import { JwtAuthGuard } from '#app/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '#app/auth/guards/local-auth.guard';
import { User } from '#app/users/entities/user.entity';
import { UsersService } from '#app/users/users.service';
import { MikroORM } from '@mikro-orm/core';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { RequestWithUser } from '#app/global/types/common.types';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private readonly orm: MikroORM,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<AuthPayload> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthPayload> {
    return this.orm.em.transactional(async (em) => {
      const user = await this.userService.create(em, {
        email: dto.email,
        password: dto.password,
        name: dto.name,
      });

      return this.authService.login(user);
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@UserParam() user: User): Promise<User> {
    return user;
  }
}
