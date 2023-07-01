import config from '../../config/default.json';

// Millisecond constants
export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_YEAR = ONE_DAY * 365;

const INTL_DATE_FORMAT_DATE = new Intl.DateTimeFormat(config.LOCALE_DEFAULT, {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});

const INTL_DATE_FORMAT_DATE_LONG = new Intl.DateTimeFormat(config.LOCALE_DEFAULT, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const INTL_DATE_FORMAT_DATE_TIME = new Intl.DateTimeFormat(config.LOCALE_DEFAULT, {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const INTL_DATE_FORMAT_DATE_TIME_LONG = new Intl.DateTimeFormat(config.LOCALE_DEFAULT, {
  dateStyle: 'long',
  timeStyle: 'medium',
});

const INTL_DATE_FORMAT_RANGE = new Intl.DateTimeFormat(config.LOCALE_DEFAULT, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/**
 * Format date and time according to locale specified format
 * @param {Date} date - Date to format
 * @param {boolean} long - Short or long format
 * @param {boolean} noComma - Useful for excel which doesn't like commas
 * @returns {string} - Formatted date
 */
export function dateTime(date, long = false, noComma = false) {
  if (!date) return null;
  let str = long ? INTL_DATE_FORMAT_DATE_TIME_LONG.format(date) : INTL_DATE_FORMAT_DATE_TIME.format(date);
  return noComma ? str.replace(',', '') : str;
}

/**
 * Format date (only) according to locale specified format
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
export function formatDate(date) {
  return date && INTL_DATE_FORMAT_DATE_LONG.format(date);
}

/**
 * Capitalize a string
 * @param {string} str - String to capitalize
 * @returns {string} - Formatted date
 */
export function capitalize(str) {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Adds a space in a person number
 * @param {string} str - String to capitalize
 * @returns {string} - Formatted date
 */
export function formatPersonNr(personNr) {
  return personNr && personNr.length === 11 ? `${personNr.slice(0, 6)} ${personNr.slice(6)}` : personNr;
}

/**
 * Adds a space in a person number
 * @param {string} str - String to capitalize
 * @returns {string} - Formatted date
 */
export function formatAdminBids(adminBids) {
  return adminBids?.includes(',') ? adminBids.split(',').reduce((soFar, current) => `${soFar}, ${current}`) : adminBids;
}
