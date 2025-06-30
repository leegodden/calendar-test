import { BaseEntity } from './base.entity';
import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { CalendarEventRepository } from '../repository/calendar-event.repository';

@Entity({
  tableName: 'elt_event',
  repository: () => CalendarEventRepository,
})
export class CalendarEventEntity extends BaseEntity {
  [EntityRepositoryType]?: CalendarEventRepository;

  @Property()
  name: string;

  @Property({ fieldName: 'start' })
  start: Date;

  @Property({ fieldName: 'end' })
  end: Date;
}
