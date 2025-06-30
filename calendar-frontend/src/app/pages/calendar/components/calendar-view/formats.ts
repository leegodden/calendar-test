import { Culture, DateLocalizer, DateRange, Formats } from 'react-big-calendar';
import { localize24HrTime } from '../../calendar.utils';

export const CalendarFormats: Formats = {
  timeGutterFormat: (
    date: Date,
    culture?: Culture,
    localizer?: DateLocalizer,
  ) => {
    return `${localize24HrTime(date, localizer)}`;
  },
  eventTimeRangeFormat: (
    range: DateRange,
    culture?: Culture,
    localizer?: DateLocalizer,
  ) => {
    return `${localize24HrTime(range.start, localizer)} - ${localize24HrTime(range.end, localizer)}`;
  },
};
