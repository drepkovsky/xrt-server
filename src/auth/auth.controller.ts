import { AuthService } from '#app/auth/auth.service';
import { UserParam } from '#app/auth/decorators/user-param.decorator';
import { JwtAuthGuard } from '#app/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '#app/auth/guards/local-auth.guard';
import { RequestWithUser } from '#app/global/types/common.types';
import { CreateUserDto } from '#app/users/dto/users.dto';
import { User } from '#app/users/entities/user.entity';
import { UsersService } from '#app/users/users.service';
import { MikroORM } from '@mikro-orm/core';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private readonly orm: MikroORM,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return {
      ...(await this.authService.login(req.user)),
      user: req.user,
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.orm.em.transactional(async (em) => {
      const user = await this.userService.create(em, {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name,
      });

      return {
        ...(await this.authService.login(user)),
        user: user,
      };
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@UserParam() user: User) {
    return user;
  }
}
