import { IO_NAMESPACE_METADATA } from '#app/global/decorators/io-gateway.decorator';
import { parseNamespace } from '#app/global/utils/gateway.utils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

// https://github.com/nestjs/nest/blob/master/packages/websockets/constants.ts
const GATEWAY_OPTIONS_METADATA = 'websockets:gateway_options';

export const IoParam = createParamDecorator<string | undefined>(
  (data: string | undefined, ctx: ExecutionContext) => {
    const socket = ctx.switchToWs().getClient() as Socket;

    const route = socket.nsp.name;

    const namespace = Reflect.getMetadata(
      IO_NAMESPACE_METADATA,
      ctx.getClass(),
    );

    const params = parseNamespace(namespace, route);

    return data ? params[data] : params;
  },
);
