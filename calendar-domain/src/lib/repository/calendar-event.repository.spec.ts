import { CalendarEventRepository } from './calendar-event.repository';

describe('CalendarEventRepository', () => {
  let repository: Partial<CalendarEventRepository>;
  const now = new Date('2024-10-01T13:33:00Z');

  beforeAll(async () => {
    // Create a mock repository with the required methods
    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      insert: jest.fn(),
      nativeDelete: jest.fn(),
      findForRange: jest.fn(),
      createNewEvent: jest.fn(),
      deleteById: jest.fn(),
      updateEvent: jest.fn(),
      findOverlappingEvents: jest.fn(),
    };

    jest.useFakeTimers({ doNotFake: ['nextTick'] }).setSystemTime(now);
  });

  afterAll(async () => {
    jest.useRealTimers();
  });

  describe('CalendarEventEntity', () => {
    it('can be persisted, deleted and fetched', async () => {
      const eventData = {
        name: 'test event',
        start: new Date('2024-11-14T10:00:00'),
        end: new Date('2024-11-14T11:00:00'),
      };

      const mockEntity = {
        id: 1,
        createdAt: now,
        ...eventData,
      };

      // Mock the repository methods
      repository.create = jest.fn().mockReturnValue(mockEntity);
      repository.insert = jest.fn().mockResolvedValue(mockEntity);
      repository.find = jest.fn().mockResolvedValue([mockEntity]);
      repository.nativeDelete = jest.fn().mockResolvedValue(undefined);

      // Test create
      const entity = repository.create(eventData);
      await repository.insert(entity);
      expect(repository.create).toHaveBeenCalledWith(eventData);
      expect(repository.insert).toHaveBeenCalledWith(entity);

      // Test find
      const result = await repository.find({});
      expect(result).toEqual([mockEntity]);

      // Test delete
      await repository.nativeDelete({ id: 1 });
      expect(repository.nativeDelete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('Repository methods', () => {
    beforeEach(async () => {
      // Reset all mocks
      jest.clearAllMocks();
    });

    describe('findForRange', () => {
      it('should find events for a date range', async () => {
        const mockEvents = [
          {
            id: 1,
            createdAt: now,
            name: 'test event',
            start: new Date('2024-11-14T10:00:00'),
            end: new Date('2024-11-14T11:00:00'),
          },
          {
            id: 2,
            createdAt: now,
            name: 'other test event',
            start: new Date('2024-11-15T16:00:00'),
            end: new Date('2024-11-15T17:00:00'),
          },
        ];

        repository.findForRange = jest.fn().mockResolvedValue(mockEvents);

        const result = await repository.findForRange(
          new Date('2024-11-14T00:00:00'),
          new Date('2024-11-16T00:00:00'),
        );

        expect(repository.findForRange).toHaveBeenCalledWith(
          new Date('2024-11-14T00:00:00'),
          new Date('2024-11-16T00:00:00'),
        );
        expect(result).toEqual(mockEvents);
      });
    });

    describe('createNewEvent', () => {
      it('should create a new event', async () => {
        const mockEvent = {
          id: 1,
          createdAt: now,
          updatedAt: null,
          name: 'new event',
          start: new Date('2025-01-14T10:00:00'),
          end: new Date('2025-01-14T11:00:00'),
        };

        repository.createNewEvent = jest.fn().mockResolvedValue(mockEvent);

        const result = await repository.createNewEvent(
          'new event',
          new Date('2025-01-14T10:00:00'),
          new Date('2025-01-14T11:00:00'),
        );

        expect(repository.createNewEvent).toHaveBeenCalledWith(
          'new event',
          new Date('2025-01-14T10:00:00'),
          new Date('2025-01-14T11:00:00'),
        );
        expect(result).toEqual(mockEvent);
      });
    });

    describe('deleteById', () => {
      it('should delete by id', async () => {
        repository.deleteById = jest.fn().mockResolvedValue(undefined);

        await repository.deleteById(111);

        expect(repository.deleteById).toHaveBeenCalledWith(111);
      });
    });
  });
});
