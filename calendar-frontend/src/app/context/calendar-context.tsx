import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EltEvent } from '../common/types';

interface CalendarContextType {
  showIds: boolean;
  setShowIds: (show: boolean) => void;
  selectedEvent: EltEvent | undefined;
  setSelectedEvent: (event: EltEvent | undefined) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
}) => {
  const [showIds, setShowIds] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EltEvent | undefined>();

  const value: CalendarContextType = {
    showIds,
    setShowIds,
    selectedEvent,
    setSelectedEvent,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error(
      'useCalendarContext must be used within a CalendarProvider',
    );
  }
  return context;
};
