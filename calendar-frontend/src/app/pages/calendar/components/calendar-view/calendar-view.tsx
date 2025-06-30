import {
  Calendar,
  momentLocalizer,
  View,
  stringOrDate,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import './styles/calendar.scss';
import { EltEvent } from '../../../../common/types';
import { CalendarFormats } from './formats';
import { useCalendarView } from '../../hooks/use-calendar-view';
import { ICalendarEvent } from '../../../../service/types';
import { useCalendarContext } from '../../../../context/calendar-context';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<EltEvent>(Calendar);

interface ICalendarViewProps {
  onNavigate: (date: Date, view: View) => void;
  events: EltEvent[];
  updateEvent: (
    event: EltEvent,
  ) => Promise<{ message: string; event: ICalendarEvent }>;
}

export const CalendarView = ({
  onNavigate,
  events,
  updateEvent,
}: ICalendarViewProps) => {
  const { setSelectedEvent } = useCalendarContext();
  const { components } = useCalendarView();

  const onEventDrop = async (args: {
    event: EltEvent;
    start: stringOrDate;
    end: stringOrDate;
  }) => {
    const newStart = new Date(args.start);
    const newEnd = new Date(args.end);
    const now = new Date(); // Current date and time

    // Check if the new start time is in the past (including today's past times)
    if (newStart < now) {
      return false;
    }

    try {
      const updatedEvent = {
        ...args.event,
        start: newStart,
        end: newEnd,
      };
      await updateEvent(updatedEvent);
    } catch (error) {
      console.error('Failed to update event on drop:', error);
      return false;
    }
  };

  const onEventResize = async (args: {
    event: EltEvent;
    start: stringOrDate;
    end: stringOrDate;
  }) => {
    const newStart = new Date(args.start);
    const newEnd = new Date(args.end);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    // Check if the new start date is in the past
    if (newStart < today) {
      // Return false to reject the resize operation
      // This will prevent the event from being resized and show a visual indication
      return false;
    }

    try {
      const updatedEvent = {
        ...args.event,
        start: newStart,
        end: newEnd,
      };
      await updateEvent(updatedEvent);
    } catch (error) {
      console.error('Failed to update event on resize:', error);
      return false; // Also reject if the API call fails
    }
  };

  return (
    <DnDCalendar
      components={components}
      defaultDate={moment().toDate()}
      events={events}
      onNavigate={onNavigate}
      defaultView={'week'}
      onSelectEvent={setSelectedEvent}
      localizer={localizer}
      formats={CalendarFormats}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      resizable
      style={{ height: '80vh' }}
      popup={true}
      dayLayoutAlgorithm={'no-overlap'}
    />
  );
};
