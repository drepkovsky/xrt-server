import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { Entity, Enum, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { nanoid } from 'nanoid';

export enum RecordingType {
  MICROPHONE = 'microphone',
  AUDIO = 'audio',
  SCREEN = 'screen',
}

@Entity()
export class Recording extends XrBaseEntity<Recording> {
  @ManyToOne(() => Respondent)
  respondent!: Ref<Respondent>;

  @Property()
  readonly token: string = nanoid();

  @Enum(() => RecordingType)
  type!: RecordingType;

  @Property({
    nullable: true,
  })
  location?: string;
}
