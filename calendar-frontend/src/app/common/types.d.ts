import { Event } from 'react-big-calendar';

export interface EltEvent extends Event {
  title: string;
  id: number;
}

type APIError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};
