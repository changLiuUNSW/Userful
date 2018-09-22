import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';

import { DateStruct } from './date-struct';
import { extendObject } from '../util/object-extend';
import { toInteger, isNumber, isUndefined } from '../util/util';
import {
  MINIMUM_LENGTH_FULL_DATE,
  MINIMUM_LENGTH_YEAR_AS_STRING,
  DATE_DAY,
  DATE_MONTH,
  NUMERIC_FULL_DATE_FORMAT,
  DATE_MONTH_YEAR,
  NO_CHAR,
  NUMERIC_FULL_DATE_FORMAT_CREDIT_CARD,
  DATE_MONTH_YEAR_CREDIT_CARD,
  MINIMUM_LENGTH_YEAR_AS_STRING_FOR_CC,
  MAXIMUM_LENGTH_YEAR_AS_STRING_FOR_CC
} from './date-regex';

// TODO: currentDate needs to get from server side format: 'dd/MM/yyyy'
export const CURRENT_DATE_TOKEN = new InjectionToken<string>('currentDate');

@Injectable()
export class DateService {
  private _today: Date = null;

  constructor( @Optional() @Inject(CURRENT_DATE_TOKEN) currentDate?: string) {
    if (currentDate) {
      const parsedDate = this.parse(currentDate);
      if (this.isValid(parsedDate)) {
        this.today = this.toJSDate(parsedDate);
      }
    }
  }

  // Support format:
  // (d or dd)(/ or - or .)(m or mm)(/ or - or .)yyyy e.g. 2/2/2000 or 02/02/2000 or 12/12/2000
  parse(value: string, hasDay: boolean = true): DateStruct {
    if (value === null || isUndefined(value)) {
      return null;
    }

    if (!hasDay) {
      value = this.regexTestAndAddDay(value);
      if (value === null) {
        return null;
      }
    }

    const year = this.getYear(value);
    if (hasDay &&
      value.length < MINIMUM_LENGTH_FULL_DATE ||
      year === null ||
      year.toString().length !== MINIMUM_LENGTH_YEAR_AS_STRING) {
      return null;
    } else if (!hasDay &&
      value.length < MINIMUM_LENGTH_YEAR_AS_STRING ||
      year === null ||
      year.toString().length !== MINIMUM_LENGTH_YEAR_AS_STRING) {
      return null;
    }

    const dateParsed = new DateStruct();
    dateParsed.day = this.getDay(value);
    dateParsed.month = this.getMonth(value);
    dateParsed.year = this.getYear(value);
    return dateParsed;
  }

  parseCreditCard(value: string): DateStruct {
    if (value === null || isUndefined(value)) {
      return null;
    }

    value = this.regexTestAndAddDayCreditCard(value);
    if (value === null) {
      return null;
    }

    const year = this.getYear(value, true);
    if (year === null ||
      year.toString().length !== MINIMUM_LENGTH_YEAR_AS_STRING_FOR_CC && year.toString().length !== MAXIMUM_LENGTH_YEAR_AS_STRING_FOR_CC) {
      return null;
    }

    const dateParsed = new DateStruct();
    dateParsed.day = this.getDay(value);
    dateParsed.month = this.getMonth(value);
    dateParsed.year = year;
    return dateParsed;
  }

  regexTestAndAddDayCreditCard(dateAsString: string): string {
    // test the selected date with regext and add a day to the selected date to be able to convert to Date object
    // year value can be parse as 2 or 4 char
    if (DATE_MONTH_YEAR_CREDIT_CARD.test(dateAsString)) {
      let month, year, date;
      if (NO_CHAR.test(dateAsString.charAt(2))) {
        if (!NO_CHAR.test(dateAsString.charAt(1))) {
          month = dateAsString.substr(0, 1);
          year = dateAsString.substr(2, dateAsString.length - 2);
          date = this.returnCreditCardDay(month, year);
          if (year.length === 2) {
            year = '20' + year;
          }
          return date + dateAsString.charAt(1) + month + dateAsString.charAt(1) + year;
        }
        month = dateAsString.substr(0, 2);
        year = dateAsString.substr(2, dateAsString.length - 2);
        date = this.returnCreditCardDay(month, year);
        if (year.length === 2) {
          year = '20' + year;
        }
        return date + month + year;

      } else {
        month = dateAsString.substr(0, 2);
        year = dateAsString.substr(3, dateAsString.length - 3);
        date = this.returnCreditCardDay(month, year);
        if (year.length === 2) {
          year = '20' + year;
        }
        return date + dateAsString.charAt(2) + month + dateAsString.charAt(2) + year;
      }
    } else {
      return null;
    }
  }

  returnCreditCardDay(_month: string, _year: string): Number {
    const month = parseInt(_month, 10);
    const year = parseInt(_year, 10);
    // to get the last day of the month, use the next month and 0 for day.
    // month is 0 based
    const creditCardDate = new Date(year, month, 0);
    return creditCardDate.getDate();
  }

  regexTestAndAddDay(value: string): string {
    // test the date value with regex and add a day to date value to be able to
    // convert to Date object
    if (DATE_MONTH_YEAR.test(value)) {
      if (NO_CHAR.test(value.charAt(2))) {
        if (!NO_CHAR.test(value.charAt(1))) {
          return '01' + value.charAt(1) + value;
        }
        return '01' + value;
      } else {
        return '01' + value.charAt(2) + value;
      }
    } else {
      return null;
    }
  }

  fromJSDate(jsDate: Date): DateStruct {
    return new DateStruct(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
  }

  toJSDate(date: DateStruct): Date {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    // this is done avoid 30 -> 1930 conversion
    if (!isNaN(jsDate.getTime())) {
      jsDate.setFullYear(date.year);
    }
    return jsDate;
  }

  isValid(date: DateStruct): boolean {
    return !!date && isNumber(date.year) &&
      isNumber(date.month) &&
      isNumber(date.day) &&
      this.validateDate(date);
  }

  addDays(date: Date, days: any, includeStartDate = true): Date {
    // default 60 days
    days = isNumber(days) ? toInteger(days) : 60;
    const result = new Date(date.valueOf());

    let daysToAdd = days;
    if (includeStartDate) {
      if (days > 0) {
        daysToAdd = days - 1;
      } else if (days < 0) {
        daysToAdd = days + 1;
      }
    }

    result.setDate(result.getDate() + daysToAdd);
    return result;
  }

  addDaysFromTextDate(textDate: string, days: any, includeStartDate = true): DateStruct {
    const startDateStruct = this.parse(textDate);
    if (startDateStruct) {
      const jsDate = this.toJSDate(startDateStruct);
      return this.fromJSDate(this.addDays(jsDate, days, includeStartDate));
    }
    return null;
  }

  set today(date: Date) {
    if (date) {
      this._today = this.clearTime(date);
    }
  }

  get today(): Date {
    return this._today || this.clearTime(new Date());
  }

  calculateAge(date: DateStruct): number {
    // milliseconds per year
    const jsDate = this.toJSDate(date);
    return (this.today.valueOf() - jsDate.valueOf()) / (31557600000);
  }

  getMonthName(month: number): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  }

  subtractYears(date: Date, years: number): Date {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year - years, month, 1);
  }

  addYearsAndMonth(date: Date, years: number, months: number): Date {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year + years, month + months, date.getDate());
  }

  // e.g 10th October 2017
  getDisplayDate(day: number, month: number, year: number): string {
    const displayMonth = this.getMonthName(month);
    let daySuffix;
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = 'st';
    } else if (day === 2 || day === 22) {
      daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
      daySuffix = 'rd';
    } else {
      daySuffix = 'th';
    }
    return `${day}${daySuffix} ${displayMonth} ${year}`;
  }

  getNormalisedDateFormat(value: string): string {
    const dateStruct = this.parse(value);
    if (dateStruct) {
      return dateStruct.toString();
    }
    return null;
  }

  areEqual(d1: string, d2: string): boolean {
    const ds1 = this.parse(d1);
    const ds2 = this.parse(d2);
    if (ds1 === null || ds2 === null) {
      return false;
    }
    return ds1.equals(ds2);
  }

  private validateDate(date: DateStruct): boolean {
    const jsDate = this.toJSDate(date);
    if (isNaN(this.toJSDate(date).getTime())) {
      return false;
    }
    return date.equals(this.fromJSDate(jsDate));
  }

  private clearTime(date: Date): Date {
    // set time of the date object to 00:00:00 - for date comparisons.
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private getDay(value: string): number {
    const matches = value.match(DATE_DAY);
    if (matches) {
      return toInteger(matches[0]);
    }
    return null;
  }

  private getMonth(value: string): number {
    const matches = value.match(DATE_MONTH);
    if (matches && matches.length === 3) {
      // example
      // dataAsString --> 25/10/1995
      // matches[0] --> 25/10  day and month
      // matches[1] --> 25 day
      // matches[2] --> 10 month
      return toInteger(matches[2]);
    }
    return null;
  }

  private getYear(value: string, isCreditCard: boolean = false): number {
    const matches = value.match(isCreditCard ? NUMERIC_FULL_DATE_FORMAT_CREDIT_CARD : NUMERIC_FULL_DATE_FORMAT);
    if (matches && matches.length === 4) {
      // example
      // dataAsString --> 11/02/1981
      // matches[0] --> 11021980
      // matches[1] --> 11 day
      // matches[2] --> 02 month
      // matches[3] --> 1981 year
      return toInteger(matches[3]);
    }
    return null;
  }
}
