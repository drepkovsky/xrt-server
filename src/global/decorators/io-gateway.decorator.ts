import { buildNamespaceRegex } from '#app/global/utils/gateway.utils';
import { GatewayMetadata, WebSocketGateway } from '@nestjs/websockets';

export const IO_NAMESPACE_METADATA = 'io:namespace';

export function IoGateway<T extends GatewayMetadata>(opts: T): ClassDecorator {
  opts.namespace =
    opts.namespace &&
    typeof opts.namespace === 'string' &&
    opts.namespace.length > 0
      ? buildNamespaceRegex(opts.namespace)
      : opts.namespace;

  return (target: any) => {
    Reflect.defineMetadata(IO_NAMESPACE_METADATA, opts.namespace, target);
    console.log(opts.namespace);
    WebSocketGateway(opts)(target);
  };
}
