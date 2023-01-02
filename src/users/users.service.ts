import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserInput: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...createUserInput,
        password: this._hashPassword(createUserInput.password),
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  validateUser(email: string, password: string) {
    return this.prisma.user
      .findUnique({
        where: { email },
      })
      .then((user) => {
        if (user && this._validatePassword(password, user.password)) {
          return user;
        }
        return null;
      });
  }

  private _hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private _validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
