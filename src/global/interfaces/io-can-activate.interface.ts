import type { Namespace, Socket } from 'socket.io';

/**
 * Custom CanActivate interface, because we are not executing from nestjs execution context.
 */
export interface IoCanActivate {
  /**
   * @param socket
   * @param io {Server or Namespace}
   */
  canActivate(socket: Socket, io: Namespace): Promise<boolean> | boolean;
}
