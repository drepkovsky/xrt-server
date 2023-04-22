import { CRUDGroup } from '#app/global/types/common.types';
import { ValidationGroup } from '#app/global/decorators/validation-group.decorator';
import { User } from '#app/users/entities/user.entity';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/mapped-types/dist/partial-type.helper.js';

@ValidationGroup(CRUDGroup.CREATE)
export class CreateUserDto extends PickType(User, ['name', 'email', 'password']) {}

@ValidationGroup(CRUDGroup.UPDATE)
export class UpdateUserDto extends IntersectionType(PartialType(CreateUserDto), PickType(User, ['id'])) {}

@ValidationGroup(CRUDGroup.FIND)
export class FindUserDto extends PartialType(PickType(User, ['name', 'email', 'id'])) {}
