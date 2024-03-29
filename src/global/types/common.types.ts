import type { Request } from 'express';
import type { Socket } from 'socket.io';
import type { User } from '#app/users/entities/user.entity';

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
