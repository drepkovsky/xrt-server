export const VALIDATION_GROUP_METADATA = 'validationGroup';

export const ValidationGroup = (group: string | string[]) => (target: any) => {
  const oldGroup = Reflect.getMetadata(VALIDATION_GROUP_METADATA, target) || [];
  group = Array.isArray(group) ? group : [group];

  Reflect.defineMetadata(VALIDATION_GROUP_METADATA, Array.from(new Set([...oldGroup, ...group])), target);
};
