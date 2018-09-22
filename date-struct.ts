export class DateStruct {
  /**
   * The year, for example 2016
   */
  year: number;

  /**
   * The month, with default calendar we use ISO 8601: 1=Jan ... 12=Dec
   */
  month: number;

  /**
   * The day of month, starting at 1
   */
  day: number;

  static from(date: { year: number, month: number, day?: number }) {
    return date ? new DateStruct(date.year, date.month, date.day ? date.day : 1) : null;
  }

  constructor(year?: number, month?: number, day?: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  equals(other: DateStruct) {
    return other && this.year === other.year && this.month === other.month && this.day === other.day;
  }

  before(other: DateStruct) {
    if (!other) {
      return false;
    }

    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day < other.day;
      } else {
        return this.month < other.month;
      }
    } else {
      return this.year < other.year;
    }
  }

  after(other: DateStruct) {
    if (!other) {
      return false;
    }
    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day > other.day;
      } else {
        return this.month > other.month;
      }
    } else {
      return this.year > other.year;
    }
  }

  toString() {
    return `${this.day}/${this.month}/${this.year}`;
  }
}
