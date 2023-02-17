import { Property } from '@mikro-orm/core';
import { PropertyOptions } from '@mikro-orm/core';

export const DateProperty = <T>(options?: PropertyOptions<T>) =>
  Property({
    type: 'timestamptz',
    length: 6,
    ...options,
  });
