import dayjs from 'dayjs';

/**
 * Returns true if a string contains only numbers.
 * @param {string} str
 * @returns {boolean}
 */
export function isNumeric(str) {
  return /^\d+$/.test(str);
}

/**
 * Verifies that a norwegian social security number is valid
 * @param {string} fnr
 * @returns {boolean}
 */
export function isSocialSecurityNumber(fnr) {
  if (!isNumeric(fnr) || fnr.length !== 11) {
    return false;
  }

  const digits = fnr.split('').map((digit) => parseInt(digit, 10));
  // calc checksum
  let k1 =
    11 -
    ((3 * digits[0] +
      7 * digits[1] +
      6 * digits[2] +
      1 * digits[3] +
      8 * digits[4] +
      9 * digits[5] +
      4 * digits[6] +
      5 * digits[7] +
      2 * digits[8]) %
      11);
  let k2 =
    11 -
    ((5 * digits[0] +
      4 * digits[1] +
      3 * digits[2] +
      2 * digits[3] +
      7 * digits[4] +
      6 * digits[5] +
      5 * digits[6] +
      4 * digits[7] +
      3 * digits[8] +
      2 * k1) %
      11);

  if (k1 === 11) k1 = 0;
  if (k2 === 11) k2 = 0;

  return k1 < 10 && k2 < 10 && k1 === digits[9] && k2 === digits[10];
}

/**
 * Verifies that it is a valid BID.
 * @param {string} str BID.
 * @returns {boolean} True if valid BID, false otherwise.
 */
export function isBid(str) {
  return /^[a-zA-Z]{3}\d{3}$/.test(str);
}

/**
 * Verifies that the string is a valid norwegian phone number.
 * @param {string} str
 * @returns {boolean}
 */
export function isPhoneNumber(str) {
  return str.length === 8 && isNumeric(str);
}

/**
 * Checks that a string is a email address
 * @param {string} str
 * @returns {boolean}
 */
export function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

/**
 * Checks if value is a date (can be unix timestamp, Date, dayjs date ojbect etc...)
 * @param {any} value
 * @returns {boolean}
 */
export function isDate(value) {
  return dayjs(value).isValid();
}

/**
 * Checks that a string, array or object is not empty
 * @param {any} value
 * @returns {boolean}
 */
export function isNotEmpty(value) {
  if (typeof value === 'string' || Array.isArray(value)) return value.length > 0;
  else if (typeof value === 'object') return Object.keys(value).length > 0;
}
