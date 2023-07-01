import { isNumeric } from './validation';

/**
 * Convert Java LocalDate ([year, month, day]) to JS Date
 * @param {Array<number>} localDate
 * @returns {Date}
 */
export function javaLocalDateToJS([year, month, day]) {
  return new Date(Date.UTC(year, month >= 1 ? month - 1 : 0, day, 0, 0, 0, 0));
}

/**
 * Convert Java LocalDateTime ([year, month, day, hour, minute, second]) to JS Date
 * @param {Array<number>} localDateTime
 * @returns {Date}
 */
export function javaLocalDateTimeToJs([year, month, day, hour, minute, second]) {
  return new Date(Date.UTC(year, month >= 1 ? month - 1 : 0, day, hour, minute, second));
}

/**
 * Convert timestamps/dates of several formats to JS Date object (UTC)
 * @param {any} date
 * @returns {(Date|null)}
 */
export function toJSDate(date) {
  if (date instanceof Date) {
    return date;
  } else if (Array.isArray(date)) {
    if (date.length === 3) return javaLocalDateToJS(date);
    if (date.length === 6) return javaLocalDateTimeToJs(date);
    return null;
  } else if (typeof date === 'number') {
    if (isNaN(date) || date < 0) return null;
    // epoch seconds
    if (date <= 99999999999) return new Date(Math.round(date * 1000));
    // epoch milliseconds
    return new Date(Math.round(date));
  } else if (typeof date === 'string') {
    if (isNumeric(date)) {
      return new Date(parseInt(date, 10));
    } else if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
      // this format is used by freg
      const year = date.substring(0, 4);
      const month = date.substring(5, 7);
      const day = date.substring(8, 11);
      return new Date(Date.UTC(year, month >= 1 ? month - 1 : 0, day, 0, 0, 0, 0));
    }
  }
  return null;
}

/**
 * Convert JS date to Java LocalDate.
 * @param {Date} date JS date.
 * @returns {Array<number>} Array of year, month and date, to be serialized as Java LocalDate.
 */
export function jsToJavaLocalDate(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}
