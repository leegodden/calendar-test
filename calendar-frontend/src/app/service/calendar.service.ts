import { ApiService } from './api.service';
import { AxiosResponse } from 'axios';
import { Moment } from 'moment';
import { ICalendarEvent } from './types';

export class CalendarService extends ApiService {
  async getEventsForRange(
    start: Moment,
    end: Moment,
  ): Promise<AxiosResponse<ICalendarEvent[]>> {
    return this._axios.get('/api/calendar/date-range', {
      params: { start: start.toISOString(), end: end.toISOString() },
    });
  }

  async createEvent(
    name: string,
    start: Moment,
    end: Moment,
  ): Promise<AxiosResponse<{ message: string; id: number }>> {
    return this._axios.post('/api/calendar/create-event', {
      name,
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  async updateEvent(
    id: number,
    start: Moment,
    end: Moment,
    name?: string,
  ): Promise<AxiosResponse<{ message: string; event: ICalendarEvent }>> {
    const payload = name
      ? { name, start: start.toISOString(), end: end.toISOString() }
      : { start: start.toISOString(), end: end.toISOString() };

    return this._axios.put(`/api/calendar/update-event/${id}`, payload);
  }
}
