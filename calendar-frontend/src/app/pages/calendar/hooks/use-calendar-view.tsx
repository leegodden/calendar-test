import { useMemo } from 'react';
import { EltEvent } from '../../../common/types';
import { useCalendarContext } from '../../../context/calendar-context';

const getCustomCalendarEventComponent =
  ({ showIds }: { showIds: boolean }) =>
  ({ event }: { event: EltEvent }) => {
    return (
      <span>
        <strong>{event.title}</strong>
        {showIds && <div>id: {event.id}</div>}
      </span>
    );
  };

export const useCalendarView = () => {
  const { showIds } = useCalendarContext();

  const components = useMemo(
    () => ({ event: getCustomCalendarEventComponent({ showIds }) }),
    [showIds],
  );

  return {
    components,
  };
};
