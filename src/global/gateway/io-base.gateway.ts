import { IO_GUARDS_METADATA } from '#app/global/decorators/use-io-guard.decorator';
import { WsExceptionFilter } from '#app/global/exceptions/ws-exception-filter';
import { IoCanActivate } from '#app/global/interfaces/io-can-activate.interface';
import { MikroORM } from '@mikro-orm/core';
import { Inject, Logger, Type, UseFilters } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

/**
 * Attach event scoped guards through @UseGuards() decorator.
 * Attach connection scoped guards through @UseIoGuard() decorator.
 */
@UseFilters(new WsExceptionFilter())
export abstract class IoBaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  logger = new Logger(this.constructor.name);
  @WebSocketServer() protected io: Namespace;
  @Inject(ModuleRef) private readonly moduleRef: ModuleRef;
  @Inject(MikroORM) protected readonly orm: MikroORM;

  /**
   * Resolve guards attached through @UseIoGuard() decorator.
   */
  private resolveGuards(): IoCanActivate[] {
    const metatypes: (IoCanActivate | Function)[] =
      Reflect.getMetadata(IO_GUARDS_METADATA, this.constructor) || [];
    return metatypes
      .map((metatype) => {
        if ((metatype as IoCanActivate).canActivate) {
          return metatype as IoCanActivate;
        }

        const injectable = this.moduleRef.get(metatype as Type<IoCanActivate>, {
          strict: false,
        });
        return injectable.canActivate ? injectable : null;
      })
      .filter((guard) => !!guard);
  }

  /**
   * Called after the initial module initialization.
   * After init provides a custom error handling layer because socket.io middlewares are not handled by nestjs exception filters.
   */
  public afterInit(io: Namespace): void {
    const guards = this.resolveGuards();
    for (const guard of guards) {
      io.use(async (socket, next) => {
        try {
          const canActivate = await guard.canActivate(socket, io);
          if (canActivate) return next();
          // if guard returns false, then we can throw a generic WsException with a 403 status
          // TODO: create a custom WsException with structure we will use throughout the project
          const e = new WsException('Forbidden');
          (e as any).data = { status: 'error', message: 'Forbidden' };
          return next(e);
        } catch (e) {
          const ex = e instanceof WsException ? e : new WsException(e.message);
          // if e is instance of WsException, then we can use e.getError() to bind to the ex.data
          if (e instanceof WsException) {
            const errData = e.getError();
            // if err is a string, then we can use it as the message
            ex.message = typeof errData === 'string' ? errData : e.message;
            (ex as any).data = { status: 'error', message: ex.message };
            // if err is an object, then we can use it as the data
            if (typeof errData === 'object')
              (ex as any).data = { ...(ex as any).data, ...errData };
          }
          return next(ex);
        }
      });
    }
    this.logger.log('Guards applied');
  }

  /**
   * Called when a new client connects to given namespace.
   */
  public handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  /**
   * Called when a new client disconnects from given namespace.
   */
  handleConnection(socket: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${socket.id}`);
  }
}
