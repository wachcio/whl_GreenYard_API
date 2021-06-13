import {
  ParseHourObj,
  GetInfoOfWeek,
  GetHoursToPay,
  HoursInWeekDay,
  Summary,
} from '../interfaces/convertingHours';

import * as dayjs from 'dayjs';
import 'dayjs/locale/pl';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as updateLocale from 'dayjs/plugin/updateLocale';
import * as AdvancedFormat from 'dayjs/plugin/advancedFormat';
import * as WeekOfYear from 'dayjs/plugin/weekOfYear';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as duration from 'dayjs/plugin/duration';
import * as objectSupport from 'dayjs/plugin/objectSupport';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as weekday from 'dayjs/plugin/weekday';
import * as isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import * as isLeapYear from 'dayjs/plugin/isLeapYear';

import { HttpException, HttpStatus } from '@nestjs/common';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(AdvancedFormat);
dayjs.extend(WeekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(duration);
dayjs.extend(objectSupport);
dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);

dayjs.tz.setDefault('Europe/Warsaw');
dayjs.locale('pl');

const timeStringToFloat = (time: string): number => {
  const hoursMinutes: string[] = time.split(/[.:]/);
  const hours: number = parseInt(hoursMinutes[0], 10);
  const minutes: number = hoursMinutes[1] ? parseFloat(hoursMinutes[1]) : 0;
  return hours + minutes / 60;
};

export const isValidDate = (date: string): boolean => {
  return dayjs(date).isValid();
};
//Returns an object that contains the provided date (string or Date object)
export const getInfoOfWeek = (
  date: string | Date = new Date(),
): GetInfoOfWeek | boolean => {
  //If user not provide data set today
  if (date === '') date = new Date();
  //If user provide wrong date return false
  if (dayjs(date).toString() == 'Invalid Date') return false;

  const obj: GetInfoOfWeek = {
    daysWhitWeekNames: [],
    days: [],
    dayDate: dayjs(date).format('YYYY-MM-DD'),
    weekNumber: -1,
    dayNumber: -1,
    dayName: '',
  };

  for (let i = 0; i <= 6; i++) {
    const dayOfWeek = dayjs(dayjs(date).startOf('w').add(i, 'day')).format(
      'DD-MM-YYYY',
    );
    const dayName = dayjs(dayjs(date).startOf('w').add(i, 'day')).format(
      'dddd',
    );

    obj.daysWhitWeekNames.push({ [dayName]: dayOfWeek });
  }

  for (let i = 0; i <= 6; i++) {
    obj.days.push(
      dayjs(dayjs(date).startOf('w').add(i, 'day')).format('DD-MM-YYYY'),
    );
  }

  obj.weekNumber = dayjs(date).isoWeek();
  obj.dayNumber = dayjs(date).isoWeekday();
  obj.dayName = dayjs(date).format('dddd');

  return obj;
};

const parseHour = (h: string): ParseHourObj => {
  if (typeof h != 'string')
    return {
      hour: -1,
      minute: -1,
    };
  // if (!Number(h)) return false;
  if (h.includes(':')) {
    const arr = h.split(':');

    if (typeof +arr[0] != 'number' && typeof +arr[1] != 'number')
      return {
        hour: -1,
        minute: -1,
      };

    return {
      hour: +arr[0],
      minute: +arr[1],
    };
  }
  if (typeof +h != 'number')
    return {
      hour: -1,
      minute: -1,
    };
  return {
    hour: +h,
    minute: 0,
  };
};
//Houer in work (start time, end time, object-negative value or string-pozitive value)
export const getHoursInWork = (
  startTimeOfWorkStr: string,
  endTimeOfWorkStr: string,
  returnObject: boolean | number = 0,
): number | duration.Duration | boolean => {
  const startTimeOfWork: ParseHourObj = parseHour(startTimeOfWorkStr);
  const endTimeOfWork: ParseHourObj = parseHour(endTimeOfWorkStr);

  if (!startTimeOfWork || !endTimeOfWork) return false;
  if (startTimeOfWork.hour > endTimeOfWork.hour) return false;

  const a = dayjs.duration({
    hours: startTimeOfWork.hour,
    minutes: startTimeOfWork.minute,
  });
  const b = dayjs.duration({
    hours: endTimeOfWork.hour,
    minutes: endTimeOfWork.minute,
  });

  const sub = b.subtract(a);

  if (returnObject) return sub;
  return timeStringToFloat(`${sub.hours()}.${sub.minutes()}`);
};
// Hours for which you will be paid (start time, end time, object-negative value or string-pozitive value)
export const getHoursWorkedWithoutBreaks = (
  startTimeOfWork: string,
  endTimeOfWork: string,
  returnObject = false,
): boolean | duration.Duration | string | number => {
  let hoursWorked = getHoursInWork(startTimeOfWork, endTimeOfWork, 1);

  if (!hoursWorked) return false;

  if (dayjs.isDuration(hoursWorked)) {
    if (parseHour(endTimeOfWork).hour >= 12) {
      const a = dayjs.duration({
        hours: hoursWorked.hours(),
        minutes: hoursWorked.minutes(),
      });
      const b = dayjs.duration({ minutes: 30 });

      hoursWorked = a.subtract(b);
    }

    if (
      parseHour(endTimeOfWork).hour == 11 &&
      parseHour(endTimeOfWork).minute > 30
    ) {
      const a = dayjs.duration({
        hours: hoursWorked.hours(),
        minutes: hoursWorked.minutes() + 30,
      });
      const b = dayjs.duration({ minutes: parseHour(endTimeOfWork).minute });

      hoursWorked = a.subtract(b);
    }

    if (returnObject) return hoursWorked;
    // return hoursWorked.format('HH:mm');
    return timeStringToFloat(`${hoursWorked.hours()}.${hoursWorked.minutes()}`);
  }
  return false;
};

export const getHoursToPay = (
  startTimeOfWork: string,
  endTimeOfWork: string,
  date: string | Date = new Date(),
): GetHoursToPay | boolean | undefined => {
  const hoursWorked = getHoursInWork(startTimeOfWork, endTimeOfWork, true);
  if (!hoursWorked) return false;

  //If user not provide data set today
  if (date === '') date = new Date();
  //If user provide wrong date return false
  if (dayjs(date).toString() == 'Invalid Date') return false;

  const dayOfWeek = dayjs(date).isoWeekday();

  let obj: GetHoursToPay = {
    dayOfWeek: dayjs(date).isoWeekday(),
    weekNumber: dayjs(date).isoWeek(),
    date: dayjs(date).format('YYYY-MM-DD'),
    dayName: dayjs(date).format('dddd'),
    normalTime: 0,
    overTime50: 0,
    overTime100: 0,
    allHours: 0,
  };
  //godziny normalne 7-15 w dzień powszedni
  //50% po 15, 100% po 21
  //sobota po 12 50%
  //niedziela 100%

  const allHours = getHoursWorkedWithoutBreaks(
    startTimeOfWork,
    endTimeOfWork,
    false,
  );

  if (dayOfWeek <= 5) {
    const maxNormalTime = 7.5;
    const maxOvertimeTime50 = 6;
    // console.log('poniedziałek do piątku');

    // console.log(allHours);

    if (+allHours <= maxNormalTime) {
      obj = {
        ...obj,
        ...{
          normalTime: +allHours,
          overTime50: 0,
          overTime100: 0,
          allHours: +allHours,
        },
      };
    } else if (+allHours <= maxNormalTime + maxOvertimeTime50) {
      obj = {
        ...obj,
        ...{
          normalTime: maxNormalTime,
          overTime50: +allHours - maxNormalTime,
          overTime100: 0,
          allHours: +allHours,
        },
      };
    } else if (+allHours > maxNormalTime + maxOvertimeTime50) {
      obj = {
        ...obj,
        ...{
          normalTime: maxNormalTime,
          overTime50: maxOvertimeTime50,
          overTime100: +allHours - maxNormalTime - maxOvertimeTime50,
          allHours: +allHours,
        },
      };
    }
  } else if (dayOfWeek === 6) {
    const maxOvertimeTime50 = 4.5;
    // console.log('sobota');
    if (+allHours <= maxOvertimeTime50) {
      obj = {
        ...obj,
        ...{
          normalTime: 0,
          overTime50: +allHours,
          overTime100: 0,
          allHours: +allHours,
        },
      };
    } else if (allHours > maxOvertimeTime50) {
      obj = {
        ...obj,
        ...{
          normalTime: 0,
          overTime50: +allHours - maxOvertimeTime50,
          overTime100: +allHours,
          allHours: +allHours,
        },
      };
    }
  } else if (dayOfWeek === 7) {
    // console.log('niedziela');
    obj = {
      ...obj,
      ...{
        normalTime: 0,
        overTime50: 0,
        overTime100: +allHours,
        allHours: +allHours,
      },
    };
  }

  return obj;
};

export const getHoursToPayInWeek = (hoursInWeek: HoursInWeekDay[]) => {
  // console.log(hoursInWeek);

  // if (typeof hoursInWeek != 'array') false;
  if (hoursInWeek.length < 7) false;

  const arr = [];

  arr.push(
    hoursInWeek.map((e: HoursInWeekDay) => {
      if (!getHoursToPay(e.startTimeOfWork, e.endTimeOfWork, e.date))
        getHoursToPay('', '', e.date);
      return getHoursToPay(e.startTimeOfWork, e.endTimeOfWork, e.date);
    }),
  );

  const summary: Summary = {
    normalTime: 0,
    overTime50: 0,
    overTime100: 0,
    allHours: 0,
  };

  const instanceofGetHoursToPay = (data: any): data is GetHoursToPay => {
    return 'normalTime' in data;
  };
  let obj = {
    week: {},
    summary: {},
  };

  arr[0].map((e) => {
    if (instanceofGetHoursToPay(e)) {
      summary.normalTime += e.normalTime;
      summary.overTime50 += e.overTime50;
      summary.overTime100 += e.overTime100;
      summary.allHours += e.allHours;
    } else {
      summary.normalTime = 0;
      summary.overTime50 = 0;
      summary.overTime100 = 0;
      summary.allHours = 0;
    }
    return obj.summary;
  });

  obj = {
    week: { ...arr },
    summary: { ...summary },
  };
  return obj;
};

export const getDaysFromWeekNumber = (
  weekNumber: number,
  year?: number,
  withNames?: boolean,
): (string | { [x: string]: string })[] => {
  const arr = [];
  if (!year) year = dayjs().year();

  if (dayjs(`${year}-01-01`).isoWeeksInYear() < weekNumber || weekNumber < 1)
    throw new HttpException(`Invalid week number.`, HttpStatus.BAD_REQUEST);

  const monday = dayjs().isoWeek(weekNumber).startOf('w').year(year);

  for (let i = 0; i <= 6; i++) {
    if (!withNames) {
      arr.push(monday.add(i, 'day').format('YYYY-MM-DD'));
    } else {
      const dayName = monday.add(i, 'day').format('dddd');
      const date = monday.add(i, 'day').format('YYYY-MM-DD');
      arr.push({ [dayName]: date });
    }
  }

  if (arr.includes('Invalid Date'))
    throw new HttpException(
      `Invalid week number or year.`,
      HttpStatus.BAD_REQUEST,
    );

  return arr;
};
export const getDaysFromMonthNumber = (
  monthNumber: number,
  year?: number,
): { [x: string]: string }[] => {
  const arr = [];
  if (!year) year = dayjs().year();

  if (monthNumber < 1 || monthNumber > 12)
    throw new HttpException(`Invalid month number.`, HttpStatus.BAD_REQUEST);
  monthNumber--;

  const firstOfMonth = dayjs().year(year).month(monthNumber).hour(2).date(1);
  const lasttOfMonth = +dayjs()
    .year(year)
    .month(monthNumber)
    .endOf('M')
    .format('DD');

  for (let i = 1; i <= lasttOfMonth; i++) {
    arr.push(firstOfMonth.add(i, 'day').format('YYYY-MM-DD'));
  }

  if (arr.includes('Invalid Date'))
    throw new HttpException(
      `Invalid month number or year.`,
      HttpStatus.BAD_REQUEST,
    );

  return arr;
};
