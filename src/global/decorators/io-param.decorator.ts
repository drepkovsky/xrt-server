import { IO_NAMESPACE_METADATA } from '#app/global/decorators/io-gateway.decorator';
import { parseNamespace } from '#app/global/utils/gateway.utils';
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Socket } from 'socket.io';

export const IoParam = createParamDecorator<string | undefined>(
  (key: string | undefined, ctx: ExecutionContext) => {
    const socket = ctx.switchToWs().getClient() as Socket;

    const route = socket.nsp.name;

    const namespace = Reflect.getMetadata(IO_NAMESPACE_METADATA, ctx.getClass()) as RegExp;
    const params = namespace ? parseNamespace(namespace, route) : {};

    return key ? params[key] : params;
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  [() => {}],
);
