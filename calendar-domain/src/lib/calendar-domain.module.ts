import { DynamicModule, Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager, MySqlDriver } from '@mikro-orm/mysql';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { entities } from './entities';
import { CalendarEventEntity } from './entity/calendar-event.entity';
import { CalendarEventRepository } from './repository/calendar-event.repository';

@Global()
@Module({})
export class CalendarDomainModule {
  static register(): DynamicModule {
    return {
      global: true,
      imports: [
        MikroOrmModule.forRoot({
          entities,
          driver: MySqlDriver,
          debug: false,
          dbName: process.env.MIKRO_ORM_DB_NAME,
          allowGlobalContext: false,
          loadStrategy: LoadStrategy.JOINED,
          driverOptions: {
            connection: {
              connectTimeout: 30000,
            },
          },
        }),
        MikroOrmModule.forFeature(entities),
      ],
      module: CalendarDomainModule,
      providers: [
        CalendarEventRepository,
        {
          provide: CalendarEventRepository,
          useFactory: (em: EntityManager) =>
            em.getRepository(CalendarEventEntity),
          inject: [EntityManager],
        },
      ],
      exports: [CalendarEventRepository],
    };
  }

  constructor(private orm: MikroORM) {}
}
