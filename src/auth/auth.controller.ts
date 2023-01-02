import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import _omit from 'lodash/omit';
import { RequestWithUser } from 'src/global/types';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return {
      ...(await this.authService.login(req.user)),
      user: _omit(req.user, 'password'),
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create({
      email: createUserDto.email,
      password: createUserDto.password,
      name: createUserDto.name,
    });

    return {
      ...(await this.authService.login(user)),
      user: _omit(user, 'password'),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() req) {
    return _omit(req.user, 'password');
  }
}
