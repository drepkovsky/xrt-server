import { DateProperty } from "#app/global/decorators/date-property.decorator";
import { XrBaseEntity } from "#app/global/entities/xr-base.entity";
import { Respondent } from "#app/studies/entities/respondents.entity";
import { Task } from "#app/studies/modules/task/entities/task.entity";
import { Entity, ManyToOne, Ref } from "@mikro-orm/core";

@Entity()
export class TaskResponse extends XrBaseEntity {
    @ManyToOne(() => Respondent)
    respondent!:Ref<Respondent>

    @ManyToOne(() => Task)
    task!:Ref<Task>

    @DateProperty()
    completedAt?:Date

    @DateProperty()
    skippedAt?:Date
}