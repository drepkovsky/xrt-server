import { AuthService } from '#app/auth/auth.service';
import { AuthPayload } from '#app/auth/auth.types';
import { UserParam } from '#app/auth/decorators/user-param.decorator';
import { LoginDto, RegisterDto } from '#app/auth/dto/auth.dto';
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
UseGuards
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
  async login(@Body() dto:LoginDto): Promise<AuthPayload> {
    return this.orm.em.transactional(async (em) => {
    const user = await this.userService.validateUser(em, dto.email, dto.password);
    return this.authService.login(user);
    });
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
  async getUser(@UserParam() user: User):Promise<User> {
    return user;
  }
}
