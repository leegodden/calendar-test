import { Module } from '@nestjs/common';

import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarDomainModule } from '@fs-tech-test/calendar-domain';

@Module({
  imports: [CalendarDomainModule.register()],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class AppModule {}
