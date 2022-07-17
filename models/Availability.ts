export interface DbAvail {
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
  display: string;
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}
