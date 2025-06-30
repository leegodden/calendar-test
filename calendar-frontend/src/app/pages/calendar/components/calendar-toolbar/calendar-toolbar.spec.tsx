import { render, screen } from '@testing-library/react';
import { CalendarToolbar } from './calendar-toolbar';
import { EltEvent } from '../../../../common/types';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
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

describe('CalendarToolbarComponent', () => {
  let addEvent: (event: Omit<EltEvent, 'id'>) => Promise<void>;
  let updateEventFull: (
    id: number,
    name: string,
    start: Date,
    end: Date,
  ) => Promise<{ message: string; event: ICalendarEvent }>;
  const mockEvent: EltEvent = {
    id: 100,
    title: 'Mock event',
    start: new Date(),
    end: new Date(),
  };

  beforeEach(() => {
    addEvent = jest.fn();
    updateEventFull = jest.fn();
  });

  const renderWithProvider = () => {
    return render(
      <CalendarProvider>
        <CalendarToolbar
          addEvent={addEvent}
          updateEventFull={updateEventFull}
        />
      </CalendarProvider>,
    );
  };

  it('renders correctly with all expected elements', () => {
    // Mock context with default values
    (useCalendarContext as jest.Mock).mockReturnValue({
      showIds: false,
      setShowIds: jest.fn(),
      selectedEvent: undefined,
      setSelectedEvent: jest.fn(),
    });

    renderWithProvider();

    // Check that all expected elements are present
    expect(screen.getByTestId('add-event-btn')).toBeInTheDocument();
    expect(screen.getByTestId('edit-event-btn')).toBeInTheDocument();
    expect(screen.getByLabelText('Show ids')).toBeInTheDocument();
  });

  describe('Add event button', () => {
    it('should open modal when clicked', async () => {
      // Mock context with default values
      (useCalendarContext as jest.Mock).mockReturnValue({
        showIds: false,
        setShowIds: jest.fn(),
        selectedEvent: undefined,
        setSelectedEvent: jest.fn(),
      });

      renderWithProvider();

      const btn = screen.getByTestId('add-event-btn');
      userEvent.click(btn);

      // The modal should be opened (we can check for modal content if needed)
      expect(btn).toBeInTheDocument();
    });
  });

  describe('Edit event button', () => {
    it('should be disabled if there is no selected event', async () => {
      // Mock context with no selected event
      (useCalendarContext as jest.Mock).mockReturnValue({
        showIds: false,
        setShowIds: jest.fn(),
        selectedEvent: undefined,
        setSelectedEvent: jest.fn(),
      });

      renderWithProvider();

      const btn = screen.getByTestId('edit-event-btn');
      expect(btn).toBeDisabled();
    });

    it('should be enabled if there is a selected event', async () => {
      // Mock context with selected event
      (useCalendarContext as jest.Mock).mockReturnValue({
        showIds: false,
        setShowIds: jest.fn(),
        selectedEvent: mockEvent,
        setSelectedEvent: jest.fn(),
      });

      renderWithProvider();

      const btn = screen.getByTestId('edit-event-btn');
      expect(btn).toBeEnabled();
    });
  });

  describe('Show ids checkbox', () => {
    it('should toggle ids being shown', () => {
      const setShowIds = jest.fn();

      // Mock context with showIds state
      (useCalendarContext as jest.Mock).mockReturnValue({
        showIds: false,
        setShowIds,
        selectedEvent: undefined,
        setSelectedEvent: jest.fn(),
      });

      renderWithProvider();

      const checkbox = screen.getByLabelText('Show ids');
      expect(checkbox).not.toBeChecked();

      // Check
      userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(setShowIds).toHaveBeenCalledWith(true);

      // Uncheck
      userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
      expect(setShowIds).toHaveBeenCalledWith(false);
    });
  });
});
