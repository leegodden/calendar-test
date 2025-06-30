import { CalendarService } from './calendar.service';
import { CalendarEventRepository } from '@fs-tech-test/calendar-domain';
import { mockCalendarEventEntity } from '../mocks/events.mock';

describe('CalendarService', () => {
  let service: CalendarService;
  let calendarEventRepository: Partial<CalendarEventRepository>;

  beforeAll(async () => {
    // Create a proper mock repository instead of real instance with null values
    calendarEventRepository = {
      findForRange: jest.fn(),
      createNewEvent: jest.fn(),
      deleteById: jest.fn(),
      updateEvent: jest.fn(),
      findOverlappingEvents: jest.fn(),
    };

    service = new CalendarService(
      calendarEventRepository as CalendarEventRepository,
    );
  });

  describe('getEvents', () => {
    it('should return events from the database', async () => {
      const findForRange = jest
        .spyOn(calendarEventRepository, 'findForRange')
        .mockResolvedValue([mockCalendarEventEntity]);

      const start = '2024-10-08T00:00:00';
      const end = '2024-10-09T00:00:00';
      await expect(service.getEvents(start, end)).resolves.toEqual([
        mockCalendarEventEntity,
      ]);
      expect(findForRange).toHaveBeenCalledWith(new Date(start), new Date(end));
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const createNewEvent = jest
        .spyOn(calendarEventRepository, 'createNewEvent')
        .mockResolvedValue(mockCalendarEventEntity);

      const findOverlappingEvents = jest
        .spyOn(calendarEventRepository, 'findOverlappingEvents')
        .mockResolvedValue([]); // No overlapping events

      const start = '2024-10-09T15:00:00';
      const end = '2024-10-09T17:00:00';
      await service.addEvent({ name: 'Mock event #1', start, end });

      expect(findOverlappingEvents).toHaveBeenCalledWith(
        new Date(start),
        new Date(end),
      );
      expect(createNewEvent).toHaveBeenCalledWith(
        'Mock event #1',
        new Date(start),
        new Date(end),
      );
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const deleteById = jest
        .spyOn(calendarEventRepository, 'deleteById')
        .mockResolvedValue();

      await service.deleteEvent(111);

      expect(deleteById).toHaveBeenCalledWith(111);
    });
  });
});
