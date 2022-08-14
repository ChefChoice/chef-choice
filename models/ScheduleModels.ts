export interface DbAvailability {
  id?: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startRecur: Date;
  endRecur: Date;
}

export interface CalendarRecurEvent {
  // title: string;
  daysOfWeek: number[];
  // startTime: string;
  // endTime: string;
  startRecur: Date;
  endRecur: Date;
}

export interface CalendarOrder {
  id: string;
  Consumer: { name: string };
  time: string;
  status: string;
}

export interface CalendarEvent {
  title: string;
  start: string;
}
