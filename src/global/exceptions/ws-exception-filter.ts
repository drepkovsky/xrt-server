import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('WsExceptionFilter', exception);

    let ex: {
      error: string;
      message: any;
    } = null;

    if (exception instanceof WsException) {
      console.log(exception.name);
      ex = {
        error: exception.name,
        message: exception.message,
      };
    } else if (exception instanceof HttpException) {
      console.log(exception.name);
      const response = exception.getResponse();
      if (typeof response === 'string') {
        ex = {
          error: exception.name,
          message: response,
        };
      } else if (typeof response === 'object') {
        ex = {
          error:
            'error' in response ? (response['error'] as any) : exception.name,
          message:
            'message' in response
              ? (response['message'] as any)
              : 'Unknown Error',
        };
      }
    } else if (exception instanceof Error) {
      ex = {
        error: 'Internal Server Error',
        message: exception.message,
      };
    }

    const callback = host.getArgByIndex(2);
    if (callback && typeof callback === 'function') {
      callback(ex);
      return;
    }

    const client = host.switchToWs().getClient();
    client.emit('exception', ex);
  }
}