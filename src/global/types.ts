import { User } from '@prisma/client';
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
