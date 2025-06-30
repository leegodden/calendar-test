import { EltEvent } from '../../../../common/types';
import { useState } from 'react';
import { ToolbarStyle } from './styles/calendar-toolbar-style';
import { EventModal } from '../date-picker/event-modal';
import { ICalendarEvent } from '../../../../service/types';
import { useCalendarContext } from '../../../../context/calendar-context';

interface ICalendarToolbarProps {
  addEvent: (event: Omit<EltEvent, 'id'>) => Promise<void>;
  updateEventFull: (
    id: number,
    name: string,
    start: Date,
    end: Date,
  ) => Promise<{ message: string; event: ICalendarEvent }>;
}

interface IEventFormData {
  title: string;
  start: Date | null;
  end: Date | null;
}

export const CalendarToolbar = ({
  addEvent,
  updateEventFull,
}: ICalendarToolbarProps) => {
  const { showIds, setShowIds, selectedEvent } = useCalendarContext();
  // const { createRandomEvent } = useCalendarToolbar(addEvent);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<IEventFormData>({
    title: '',
    start: null,
    end: null,
  });

  const editEvent = (event?: EltEvent) => {
    if (!event) return;

    setFormData({
      title: event.title,
      start: event.start || new Date(),
      end: event.end || new Date(),
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAddEventClick = () => {
    setFormData({
      title: '',
      start: null,
      end: null,
    });
    setModalMode('create'); // Set mode to create
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
    setFormData({
      title: '',
      start: null,
      end: null,
    });
  };

  const handleFormDataChange = (
    field: keyof IEventFormData,
    value: string | Date | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSetError = (message: string) => {
    setErrorMessage(message);
  };

  const handleClearError = () => {
    setErrorMessage('');
  };

  return (
    <>
      <div css={ToolbarStyle}>
        <button data-testid="add-event-btn" onClick={handleAddEventClick}>
          Add event
        </button>
        <button
          data-testid="edit-event-btn"
          onClick={() => editEvent(selectedEvent)}
          disabled={!selectedEvent}
        >
          Edit event
        </button>
        <label htmlFor="show-ids-checkbox">
          <input
            id="show-ids-checkbox"
            type="checkbox"
            defaultChecked={showIds}
            onClick={(e) => setShowIds(e.currentTarget.checked)}
          ></input>
          Show ids
        </label>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        eventToEdit={selectedEvent}
        onSubmit={addEvent}
        onUpdate={updateEventFull}
        formData={formData}
        onFormDataChange={handleFormDataChange}
        errorMessage={errorMessage}
        onSetError={handleSetError}
        onClearError={handleClearError}
      />
    </>
  );
};
