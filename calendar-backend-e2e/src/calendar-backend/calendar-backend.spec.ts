import axios from 'axios';

describe('GET /api/calendar', () => {
  const baseUrl = '/api/calendar';
  const eventIds: number[] = [];

  beforeEach(async () => {
    const {
      data: { id: id1 },
    } = await axios.post(`${baseUrl}/create-event`, {
      name: 'Event 1',
      start: '2024-10-07T13:00:00',
      end: '2024-10-07T14:00:00',
    });
    eventIds.push(id1);

    const {
      data: { id: id2 },
    } = await axios.post(`${baseUrl}/create-event`, {
      name: 'Event 2',
      start: '2024-10-08T15:00:00',
      end: '2024-10-08T16:00:00',
    });
    eventIds.push(id2);
  });

  afterEach(async () => {
    for (const id of eventIds) {
      await axios.delete(`${baseUrl}/delete-event/${id}`);
    }
  });

  describe('date-range', () => {
    it('should return bookings within range', async () => {
      const start = '2024-10-07T00:00:00';
      const end = '2024-10-09T00:00:00';
      const { status, data } = await axios.get(`${baseUrl}/date-range`, {
        params: { start, end },
      });

      expect(status).toBe(200);
      expect(data).toEqual([
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(String),
          name: 'Event 1',
          start: '2024-10-07T13:00:00.000Z',
          end: '2024-10-07T14:00:00.000Z',
        }),
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(String),
          name: 'Event 2',
          start: '2024-10-08T15:00:00.000Z',
          end: '2024-10-08T16:00:00.000Z',
        }),
      ]);
    });

    it('should return empty list if no bookings within range', async () => {
      const start = '2025-10-07T00:00:00';
      const end = '2025-10-08T00:00:00';
      const { status, data } = await axios.get(`${baseUrl}/date-range`, {
        params: { start, end },
      });

      expect(status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should fail if start not specified', async () => {
      const end = '2025-10-08T00:00:00';
      const { status, data } = await axios.get(`${baseUrl}/date-range`, {
        params: { end },
        validateStatus: () => true,
      });

      expect(status).toBe(400);
      expect(data.message).toEqual('No start/end specified');
    });

    it('should fail if end not specified', async () => {
      const start = '2025-10-08T00:00:00';
      const { status, data } = await axios.get(`${baseUrl}/date-range`, {
        params: { start },
        validateStatus: () => true,
      });

      expect(status).toBe(400);
      expect(data.message).toEqual('No start/end specified');
    });
  });
});
