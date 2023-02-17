import { User } from '#app/users/entities/user.entity';
import { Request } from 'express';
import { Socket } from 'socket.io';

export interface RequestWithUser extends Request {
  user: User;
}

export interface SocketWithUser extends Socket {
  data: {
    user: User;
  };
}

export enum CRUDGroup {
  CREATE = 'create',
  UPDATE = 'update',
  FIND = 'find',
  DELETE = 'delete',
}
