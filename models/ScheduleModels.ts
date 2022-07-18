export interface DbAvailability {
  id: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startRecur: Date;
  endRecur: Date;
}

export interface CalendarRecurEvent {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startRecur: Date;
  endRecur: Date;
}

export interface CalendarOrder {
  id: string;
  Consumer: { name: string };
  schedtime: Date;
  status: string;
}

export interface CalendarEvent {
  title: string;
  start: Date;
}
