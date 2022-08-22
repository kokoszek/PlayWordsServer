
export type InputTypeFromEntity<Entity> = {
  [Property in keyof Entity]: Entity[Property];
};
