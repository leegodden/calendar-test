import { DateLocalizer } from 'react-big-calendar';

export const localize24HrTime = (
  date: Date,
  localizer?: DateLocalizer,
): string | undefined => {
  return localizer?.format(date, 'HH:mm');
};
