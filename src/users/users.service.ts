import { CreateUserDto, FindUserDto } from '#app/users/dto/users.dto';
import { User } from '#app/users/entities/user.entity';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  async create(em: EntityManager, dto: CreateUserDto) {
    const user = em.create(User, {
      ...dto,
      password: this._hashPassword(dto.password),
    });

    await em.persistAndFlush(user);
    return user;
  }

  findOne(em: EntityManager, dto: FindUserDto) {
    return em.findOne(User, dto);
  }

  validateUser(em: EntityManager, email: string, password: string) {
    return this.findOne(em, { email }).then((user) => {
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
