import { UsersService } from '#app/users/users.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [UsersService],
})
export class UsersModule {}
