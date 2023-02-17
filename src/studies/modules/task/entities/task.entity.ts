import { CRUDGroup } from "#app/global/common.types";
import { XrBaseEntity } from "#app/global/entities/xr-base.entity";
import { Study } from "#app/studies/entities/study.entity";
import { TaskResponse } from "#app/studies/modules/task/entities/task-response.entity";
import { Collection, Entity, ManyToOne, OneToMany, Property, Ref } from "@mikro-orm/core";
import { IsOptional, MaxLength, MinLength } from "class-validator";

@Entity()
export class Task extends XrBaseEntity {
    @MaxLength(255)
    @MinLength(2)
    @IsOptional({groups:[CRUDGroup.UPDATE]})
    @Property()
    name!:string

    @MaxLength(500)
    @MinLength(1)
    text!:string

    @ManyToOne(() => Study)
    study!:Ref<Study>

    @Property()
    isRequired:boolean = false

    @OneToMany(() => TaskResponse, r=>r.task)
    responses:Collection<TaskResponse> = new Collection<TaskResponse>(this)

}