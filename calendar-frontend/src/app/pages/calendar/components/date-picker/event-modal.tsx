import { EltEvent } from '../../../../common/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-picker-style.css';
import './event-modal-style.css';
import { ICalendarEvent } from '../../../../service/types';
import { APIError } from '../../../../common/types';
import calendarIcon from '../../../../../assets/calendar-icon.svg';

interface IEventFormData {
  title: string;
  start: Date | null;
  end: Date | null;
}

interface IEventModalProps {
  errorMessage?: string;
  onClearError?: () => void;
  onSetError?: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  eventToEdit?: EltEvent;
  onSubmit: (event: Omit<EltEvent, 'id'>) => Promise<void>;
  onUpdate: (
    id: number,
    name: string,
    start: Date,
    end: Date,
  ) => Promise<{ message: string; event: ICalendarEvent }>;
  formData: IEventFormData;
  onFormDataChange: (
    field: keyof IEventFormData,
    value: string | Date | null,
  ) => void;
}

export const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  formData,
  eventToEdit,
  mode,
  onFormDataChange,
  errorMessage,
  onClearError,
  onSetError,
}: IEventModalProps) => {
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      if (onSetError) {
        onSetError('Please enter an event title');
      }
      return;
    }

    if (!formData.start || !formData.end) {
      if (onSetError) {
        onSetError('Please select both start and end times');
      }
      return;
    }

    if (formData.start >= formData.end) {
      if (onSetError) {
        onSetError('Start time must be before end time');
      }
      return;
    }

    if (formData.start < new Date()) {
      if (onSetError) {
        onSetError('Start time cannot be in the past');
      }
      return;
    }

    try {
      if (mode === 'create') {
        await onSubmit({
          title: formData.title.trim(),
          start: formData.start,
          end: formData.end,
        });
      } else {
        await onUpdate(
          eventToEdit!.id,
          formData.title.trim(),
          formData.start,
          formData.end,
        );
      }
      onClose();
    } catch (error: unknown) {
      const apiError = error as APIError;
      console.error(`Failed to ${mode} event:`, error);

      let errorMessage = `Failed to ${mode} event. Please try again.`;

      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      if (onSetError) {
        onSetError(errorMessage);
      }
    }
  };

  if (!isOpen) return null;

  const handleFormDataChange = (
    field: keyof IEventFormData,
    value: string | Date | null,
  ) => {
    onFormDataChange(field, value);
    // Clear error when user starts typing/changing data
    if (onClearError) {
      onClearError();
    }
  };

  return (
    <div className="event-modal-overlay">
      <div className="event-modal-container">
        <h2 className="event-modal-title">
          {mode === 'create' ? 'Create New Event' : 'Edit Event'}
        </h2>
        {/* NEW ERROR */}
        {errorMessage && (
          <div className="event-modal-error">{errorMessage}</div>
        )}

        <form onSubmit={handleFormSubmit} noValidate>
          <div className="event-modal-form-group">
            <label className="event-modal-label">Event Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFormDataChange('title', e.target.value)}
              className="event-modal-input"
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="event-modal-form-group">
            <label className="event-modal-label">Start Time *</label>
            <div className="date-picker-with-icon">
              <DatePicker
                selected={formData.start}
                onChange={(date) => handleFormDataChange('start', date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select start date and time"
                required
              />
              <img
                src={calendarIcon}
                alt="Calendar"
                className="calendar-icon"
              />
            </div>
          </div>
          <div className="event-modal-form-group">
            <label className="event-modal-label">End Time *</label>
            <div className="date-picker-with-icon">
              <DatePicker
                selected={formData.end}
                onChange={(date) => handleFormDataChange('end', date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select end date and time"
                required
              />
              <img
                src={calendarIcon}
                alt="Calendar"
                className="calendar-icon"
              />
            </div>
          </div>
          <div className="event-modal-button-group">
            <button
              type="button"
              onClick={onClose}
              className="event-modal-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="event-modal-button event-modal-button--primary"
            >
              {mode === 'create' ? 'Create Event' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
