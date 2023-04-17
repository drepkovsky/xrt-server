import { ValidationGroup } from '#app/global/decorators/validation-group.decorator';
import { CRUDGroup } from '#app/global/types/common.types';
import { Event } from '#app/studies/entities/event.entity';
import { PickType } from '@nestjs/mapped-types';

@ValidationGroup(CRUDGroup.CREATE)
export class CreateEventDto extends PickType(Event, ['name', 'description']) {}
