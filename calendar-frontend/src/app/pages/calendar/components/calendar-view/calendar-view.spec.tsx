import { render, screen, within } from '@testing-library/react';
import { CalendarView } from './calendar-view';
import { View } from 'react-big-calendar';
import { EltEvent } from '../../../../common/types';
import '@testing-library/jest-dom';
import {
  CalendarProvider,
  useCalendarContext,
} from '../../../../context/calendar-context';
import { ICalendarEvent } from '../../../../service/types';
import React from 'react';

// Mock the calendar context
jest.mock('../../../../context/calendar-context', () => ({
  useCalendarContext: jest.fn(),
  CalendarProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('CalendarView', () => {
  let onNavigate: (date: Date, view: View) => void;
  let updateEvent: (
    event: EltEvent,
  ) => Promise<{ message: string; event: ICalendarEvent }>;
  const mockEvent: EltEvent = {
    id: 100,
    title: 'Mock event',
    start: new Date('2024-10-11T12:15:00Z'),
    end: new Date('2024-10-11T12:45:00Z'),
  };

  beforeEach(() => {
    onNavigate = jest.fn();
    updateEvent = jest.fn();
    jest.useFakeTimers().setSystemTime(new Date('2024-10-11T10:30:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderWithProvider = () => {
    return render(
      <CalendarProvider>
        <CalendarView
          onNavigate={onNavigate}
          events={[]}
          updateEvent={updateEvent}
        />
      </CalendarProvider>,
    );
  };

  it('should render an empty calendar', () => {
    // Mock context with default values
    (useCalendarContext as jest.Mock).mockReturnValue({
      showIds: false,
      setShowIds: jest.fn(),
      selectedEvent: undefined,
      setSelectedEvent: jest.fn(),
    });

    renderWithProvider();

    // Check that the calendar container is present
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    // Check that the calendar has the expected class
    const calendarContainer = document.querySelector(
      '.rbc-addons-dnd.rbc-calendar',
    );
    expect(calendarContainer).toBeInTheDocument();
  });

  it('should render a calendar with an event', () => {
    // Mock context with default values
    (useCalendarContext as jest.Mock).mockReturnValue({
      showIds: false,
      setShowIds: jest.fn(),
      selectedEvent: undefined,
      setSelectedEvent: jest.fn(),
    });

    render(
      <CalendarProvider>
        <CalendarView
          onNavigate={onNavigate}
          events={[mockEvent]}
          updateEvent={updateEvent}
        />
      </CalendarProvider>,
    );

    // Check that the calendar container is present
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    // Check that the event is rendered
    const eventLabel = screen.getByText('Mock event');
    const event = eventLabel.closest('.rbc-event') as HTMLElement;
    const eventTime = event?.querySelector('.rbc-event-label');

    expect(eventTime).toHaveTextContent('12:15 - 12:45');
    expect(within(event).queryByText('id: 100')).not.toBeInTheDocument();
  });

  it('should show event ids if flag is set', () => {
    // Mock context with showIds set to true
    (useCalendarContext as jest.Mock).mockReturnValue({
      showIds: true,
      setShowIds: jest.fn(),
      selectedEvent: undefined,
      setSelectedEvent: jest.fn(),
    });

    render(
      <CalendarProvider>
        <CalendarView
          onNavigate={onNavigate}
          events={[mockEvent]}
          updateEvent={updateEvent}
        />
      </CalendarProvider>,
    );

    const eventLabel = screen.getByText('Mock event');
    const event = eventLabel.closest('.rbc-event') as HTMLElement;

    expect(within(event).queryByText('id: 100')).toBeInTheDocument();
  });
});
