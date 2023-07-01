/**
 * Remove a property from an object
 * @param {string} key
 * @param {object} object
 * @returns {object} new object without property
 */
export function omitKey(key, { [key]: _, ...withoutKey }) {
  return withoutKey;
}

/**
 * Function that returns the user to previous page (from location.state.from)
 * or a fallback page if state.from does not exist in history state
 * @param {History} history
 * @param {import('/modules').App} app
 * @param {string} fallback
 */
export function exitPage(history, fallback) {
  history.replace(history.location.state?.from ?? fallback);
}

/**
 * Truncates a string and addd ellipsis at the end if the string length exceeds limit
 * @param {string} str
 * @param {number} limit
 * @returns {string}
 */
export function truncate(str, limit = 120) {
  if (str?.length > limit) {
    return str.substring(0, limit) + '...';
  }
  return str;
}

export const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export { default as useKeyPress } from './usekeypress';
export { default as useOnClickOutside } from './useonclickoutside';
export { default as prepadZeroes } from './prepadzeroes';
export { default as useExitPagePrompt } from './useexitpageprompt';
export * from './validation';

export const TABLE_PAGINATION_ALL = 9999;
