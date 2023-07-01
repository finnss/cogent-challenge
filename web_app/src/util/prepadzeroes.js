/**
 * Retrieves the errors relevant for the given name, including when the name is nested like aggressor.fullName.
 * @param {string} name
 * @param {object} errors
 * @returns {object}
 */
export default function prepadZeroes(toPrepad, finalLength = 5) {
  if (!toPrepad || toPrepad.length === 0) return toPrepad;
  let toReturn = `${toPrepad}`;
  let startString;
  if (toPrepad[0] === 'S' || toPrepad[0] === 'V') {
    toReturn = toReturn.slice(1);
    startString = toPrepad[0];
  }
  while (toReturn.length < finalLength) {
    toReturn = '0' + toReturn;
  }
  if (startString) toReturn = startString + toReturn;
  return toReturn;
}
