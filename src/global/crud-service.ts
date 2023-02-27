import { XrBaseEntity } from '#app/global/entities/xr-base.entity';
import { User } from '#app/users/entities/user.entity';
import {
  EntityClass,
  EntityData,
  EntityManager,
  FindOptions,
  ObjectQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Logger, NotFoundException } from '@nestjs/common';

export type CRUDFields<E, R extends string = never> = FindOptions<
  E,
  R
>['populate'];

export abstract class CRUDService<
  E extends XrBaseEntity<any>,
  CreateDto,
  UpdateDto extends { id: string },
  FindManyDto,
  Entity extends EntityClass<E> = EntityClass<E>,
> {
  // TODO: type any for now because of autopath nature
  protected abstract updatableFields: any;
  protected abstract findOneRelations: any;
  protected abstract findManyRelations: any;
  protected abstract updateRelations: any;
  protected abstract removeRelations: any;

  protected _buildFields<R extends string = never>(
    relations: CRUDFields<E, R> = [],
  ): CRUDFields<E, R> {
    return relations;
  }

  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly entity: Entity,
    private readonly shouldSoftRemove = true,
  ) {}

  /**
   *
   * @param dto to create the payload from
   * @param user making the changes (useful for updating createdBy/updatedBy fields)
   */
  protected abstract resolveCreatePayload(
    dto: CreateDto,
    user: User,
  ): Promise<RequiredEntityData<E>>;

  /**
   * Query used to find connect between user executing the query and the entity
   */
  protected abstract resolveUserQuery(user: User): ObjectQuery<E>;
  /**
   * Resolve the query used to find entities from the findDto
   */
  protected abstract resolveFindManyQuery(findDto: FindManyDto): ObjectQuery<E>;
  /**
   * Resolve the options used to apply to the find query
   */
  protected abstract resolveFindOptions(findDto: FindManyDto): FindOptions<E>;

  /**
   * @param dtop to create the update payload from
   * @param user making the changes (useful for updating createdBy/updatedBy fields)
   */
  protected abstract resolveUpdatePayload(
    dto: UpdateDto,
    user: User,
  ): Promise<EntityData<E>>;

  protected abstract handleRelationRemoval<E>(
    em: EntityManager,
    entity: E,
    shouldSoftRemove: boolean,
  ): Promise<void>;

  async create(em: EntityManager, dto: CreateDto, user: User) {
    this.logger.debug(`Creating ${this.entity.name} with payload: ${dto}`);
    const payload = await this.resolveCreatePayload(dto, user);
    const entity = em.create(this.entity, payload);

    // always flush after create to ensure that the entity has an id when continuing in transaction
    em.persistAndFlush(entity);

    this.logger.debug(`Created ${this.entity.name} with  new id: ${entity.id}`);
    return entity;
  }

  async findAll(em: EntityManager, findDto: FindManyDto, user: User) {
    this.logger.debug(`Finding ${this.entity.name} with query: ${findDto}`);

    return em
      .find(
        this.entity,
        {
          ...this.resolveFindManyQuery(findDto),
          ...this.resolveUserQuery(user),
        },
        this.resolveFindOptions(findDto),
      )
      .then((result) => {
        this.logger.debug(`Found ${this.entity.name} with query: ${findDto}`);
        return result;
      });
  }

  async count(em: EntityManager, findDto: FindManyDto, user: User) {
    this.logger.debug(`Counting ${this.entity.name} with query: ${findDto}`);

    return em
      .count(this.entity, this.resolveFindManyQuery(findDto))
      .then((result) => {
        this.logger.debug(`Counted ${this.entity.name} with query: ${findDto}`);
        return result;
      });
  }

  async findOne(
    em: EntityManager,
    id: string,
    user: User,
    relations: CRUDFields<E> = this.findOneRelations,
  ) {
    this.logger.debug(`Finding ${this.entity.name} with id: ${id}`);

    return em
      .findOne(
        this.entity,
        { id, ...this.resolveUserQuery(user) },
        { populate: relations },
      )
      .then((result) => {
        if (!result) {
          throw new NotFoundException(
            `${this.entity.name} with id: ${id} not found`,
          );
        }

        this.logger.debug(`Found ${this.entity.name} with id: ${id}`);
        return result;
      });
  }

  async update(em: EntityManager, dto: UpdateDto, user: User) {
    this.logger.debug(`Updating ${this.entity.name} with id: ${dto.id}`);

    const entity = await this.findOne(em, dto.id, user);
    const payload = await this.resolveUpdatePayload(dto, user);

    em.assign(entity, payload, { mergeObjects: true });

    this.logger.debug(`Updated ${this.entity.name} with id: ${dto.id}`);
    return em.persist(entity);
  }

  async remove(em: EntityManager, id: string, user: User) {
    this.logger.debug(`Removing ${this.entity.name} with id: ${id}`);

    const entity = await this.findOne(em, id, user, this.removeRelations);
    await this.handleRelationRemoval(em, entity, this.shouldSoftRemove);

    if (this.shouldSoftRemove) {
      entity.softRemove();
      em.persist(entity);
      return entity;
    }

    em.remove(entity);
    this.logger.debug(`Removed ${this.entity.name} with id: ${id}`);
    return entity;
  }
}
