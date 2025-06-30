import moment from 'moment/moment';
import { random } from 'lodash';
import { EltEvent } from '../../../common/types';

export const useCalendarToolbar = (
  addEvent: (event: Omit<EltEvent, 'id'>) => Promise<void>,
) => {
  const createRandomEvent = async () => {
    // Start in the next 48h
    const start = moment().add(random(15, 48 * 60), 'minutes');
    // Last between 30m and 1h 30m
    const end = start.clone().add(random(30, 90), 'minutes');
    const title = `Random event ${random(1, 9999)}`;

    await addEvent({ title, start: start.toDate(), end: end.toDate() });
  };

  return {
    createRandomEvent,
  };
};
