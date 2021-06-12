export interface ParseHourObj {
  hour: number;
  minute: number;
}

export interface GetInfoOfWeek {
  daysWhitWeekNames: Object[];
  days: Array<string>;
  weekNumber: number;
  dayDate: string;
  dayNumber: number;
  dayName: string;
}

export interface GetHoursToPay {
  dayOfWeek: number;
  weekNumber: number;
  date: string;
  dayName: string;
  normalTime: number;
  overTime50: number;
  overTime100: number;
  allHours: number;
}

export interface HoursInWeekDay {
  date: string | Date;
  startTimeOfWork: string;
  endTimeOfWork: string;
}

export interface Summary {
  normalTime: number;
  overTime50: number;
  overTime100: number;
  allHours: number;
}
