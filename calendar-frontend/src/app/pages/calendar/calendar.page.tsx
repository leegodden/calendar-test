import { CalendarView } from './components/calendar-view/calendar-view';
import { CalendarToolbar } from './components/calendar-toolbar/calendar-toolbar';
import { useCalendar } from './hooks/use-calendar';

export const CalendarPage = () => {
  const { events, addEvent, updateEvent, updateEventFull, onNavigate } =
    useCalendar();

  return (
    <div>
      <CalendarToolbar addEvent={addEvent} updateEventFull={updateEventFull} />
      <CalendarView
        onNavigate={onNavigate}
        events={events}
        updateEvent={updateEvent}
      />
    </div>
  );
};
