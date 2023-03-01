import { IoCanActivate } from '#app/global/interfaces/io-can-activate.interface';

export const IO_GUARDS_METADATA = 'ioGuards:metadata';

type IoGuard = IoCanActivate | Function;

export function UseIoGuard(...middlewares: IoGuard[]) {
  return (target: any) => {
    const existingGuards =
      Reflect.getMetadata(IO_GUARDS_METADATA, target) || [];
    const guards = [...existingGuards, ...middlewares];
    // be sure to set deduped guards
    Reflect.defineMetadata(IO_GUARDS_METADATA, [...new Set(guards)], target);
  };
}
