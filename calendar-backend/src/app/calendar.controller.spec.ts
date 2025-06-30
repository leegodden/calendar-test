import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { mockCalendarEventEntity } from '../mocks/events.mock';

describe('CalendarController', () => {
  let app: TestingModule;
  let controller: CalendarController;
  const calendarService = new CalendarService(null);

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [CalendarController],
      providers: [CalendarService],
    })
      .overrideProvider(CalendarService)
      .useValue(calendarService)
      .compile();
    controller = app.get<CalendarController>(CalendarController);
  });

  describe('getEvents', () => {
    it('should return list of events for a date range', async () => {
      const start = '2024-10-01T00:00:00';
      const end = '2024-10-06T00:00:00';
      const getEvents = jest
        .spyOn(calendarService, 'getEvents')
        .mockResolvedValueOnce([mockCalendarEventEntity]);

      await expect(controller.getEvents(start, end)).resolves.toEqual([
        mockCalendarEventEntity,
      ]);
      expect(getEvents).toHaveBeenCalledWith(start, end);
    });
  });

  describe('createEvent', () => {
    it('should create an event and return success message', async () => {
      const addEvent = jest
        .spyOn(calendarService, 'addEvent')
        .mockResolvedValue(10);
      const payload = {
        name: 'new event',
        start: '2024-10-01T00:00:00',
        end: '2024-10-01T02:00:00',
      };

      // Mock response object
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.createEvent(payload, mockResponse);

      expect(addEvent).toHaveBeenCalledWith(payload);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Event created',
        id: 10,
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event and return success message', async () => {
      const deleteEvent = jest
        .spyOn(calendarService, 'deleteEvent')
        .mockResolvedValue();

      await expect(controller.deleteEvent(111)).resolves.toEqual({
        message: 'Event deleted',
        id: 111,
      });
      expect(deleteEvent).toHaveBeenCalledWith(111);
    });
  });
});
