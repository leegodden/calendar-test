import { useEffect, useState, useCallback, useMemo } from 'react';
import moment, { unitOfTime, Moment } from 'moment/moment';
import { View } from 'react-big-calendar';
import { EltEvent } from '../../../common/types';
import { CalendarService } from '../../../service/calendar.service';

export const useCalendar = () => {
  const calendarService = useMemo(() => new CalendarService(), []);
  const [events, setEvents] = useState<EltEvent[]>([]);

  const fetchEvents = useCallback(
    async (start: Moment, end: Moment) => {
      const { data } = await calendarService.getEventsForRange(start, end);
      const processedEvents: EltEvent[] = data.map((e) => ({
        id: e.id,
        title: e.name,
        start: new Date(e.start),
        end: new Date(e.end),
      }));
      setEvents(processedEvents);
    },
    [calendarService],
  );

  useEffect(() => {
    const today = moment();
    fetchEvents(today.startOf('week'), today.clone().endOf('week'));
  }, [fetchEvents]);

  const onNavigate = async (newDate: Date, view: View) => {
    const newMutableDate = moment(newDate);
    const unitOfTime = viewToUnitOfTime(view);
    await fetchEvents(
      newMutableDate.startOf(unitOfTime),
      newMutableDate.clone().endOf(unitOfTime),
    );
  };

  const addEvent = async (event: Omit<EltEvent, 'id'>) => {
    const {
      data: { id },
    } = await calendarService.createEvent(
      event.title,
      moment(event.start),
      moment(event.end),
    );
    setEvents((events) => [...events, { ...event, id }]);
  };

  const updateEvent = async (event: EltEvent) => {
    try {
      const { data } = await calendarService.updateEvent(
        event.id,
        moment(event.start),
        moment(event.end),
      );

      // Update the local state with the updated event
      setEvents((events) =>
        events.map((e) => (e.id === event.id ? { ...e, ...event } : e)),
      );

      return data;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  };

  const updateEventFull = async (
    id: number,
    name: string,
    start: Date,
    end: Date,
  ) => {
    try {
      const { data } = await calendarService.updateEvent(
        id,
        moment(start),
        moment(end),
        name,
      );

      setEvents((events) =>
        events.map((e) =>
          e.id === id ? { ...e, title: name, start, end } : e,
        ),
      );

      return data;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  };

  const viewToUnitOfTime = (view: View): unitOfTime.StartOf => {
    switch (view) {
      case 'day':
      case 'week':
      case 'month':
        return view;
      case 'agenda':
        return 'month';
      default:
        return 'week';
    }
  };

  return {
    events,
    onNavigate,
    addEvent,
    updateEvent,
    updateEventFull,
  };
};
