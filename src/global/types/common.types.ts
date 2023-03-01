import { User } from '#app/users/entities/user.entity';
import { Request } from 'express';
import { Socket } from 'socket.io';

export enum CRUDGroup {
  CREATE = 'create',
  UPDATE = 'update',
  FIND = 'find',
  DELETE = 'delete',
}

export enum UpdateOperation {
  ADD = 'add',
  REMOVE = 'remove',
  REPLACE = 'replace',
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface SocketWithUser extends Socket {
  data: {
    user: User;
  };
}
// rework to module augmentation
