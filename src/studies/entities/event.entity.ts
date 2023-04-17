import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@Entity()
export class Event extends XrBaseEntity<Event> {
  @ManyToOne(() => Respondent, { ref: true })
  respondent!: Ref<Respondent>;

  @IsString()
  @MaxLength(32)
  @Property()
  name!: string;

  @IsOptional()
  @MaxLength(512)
  @Property({ nullable: true })
  description?: string;
}
