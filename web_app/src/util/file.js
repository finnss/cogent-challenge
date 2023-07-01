// import { AsyncParser } from 'json2csv';

/**
 * Converts JSON string to CSV string.
 * @param {string} jsonString JSON string to be converted.
 * @param {Array<Object>} fields Fields required by json2csv (this can also be used to manipulate
 * values). This is an array of objects or strings. See json2csv documentation for more information.
 * @param {function} callback Callback function when conversion is complete, takes CSV string as
 * parameter.
 * @returns {Promise<string>}
 */
export const jsonToCsv = (jsonString, fields) =>
  new Promise((resolve, reject) => {
    // Create async json2csv parser. Set withBOM for correct encoding in Excel.
    // const asyncParser = new AsyncParser({ fields: fields, delimiter: ';', withBOM: true });
    const asyncParser = undefined;

    // CSV string to build.
    let csv = '';

    // Create processor that goes through the JSON string, and function to call when it ends.
    asyncParser.processor
      .on('data', (chunk) => (csv += chunk.toString()))
      .on('end', () => resolve(csv))
      .on('error', (err) => reject(new Error('Could not convert json to csv: ', err)));

    // Input JSON string that will be converted. Push null to end stream.
    asyncParser.input.push(jsonString);
    asyncParser.input.push(null);
  });

/**
 * Download a CSV file with a certain filename.
 * @param {string} filename Name of file to be downloaded.
 * @param {string} csvString CSV content as string.
 */
export function downloadCsvFile(filename, csvString) {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  downloadFile(blob, filename);
}

/**
 * Download a JSON file with a certain filename.
 * @param {string} filename Name of file to be downloaded.
 * @param {string} jsonString JSON content as string.
 */
export function downloadJsonFile(filename, jsonString) {
  const data = `[${jsonString}]`;
  const blob = new Blob([data], { type: 'application/json' });
  downloadFile(blob, filename);
}

/**
 * Function used to print an html element to PDF. Works by maximizing the element to cover the entire window,
 * then calling print and resetting css right after.
 * @param {HTMLElement} element
 */
export function printElementToPdf(element) {
  const maximizeCss = {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    margin: 0,
    padding: '16px',
  };

  const previousCss = _.pick(element.style, Object.keys(maximizeCss));
  element.style = { ...element.style, ...maximizeCss };
  window.print();
  element.style = { ...element.style, ...previousCss };
}

/**
 * Download file.
 * @private
 * @param {Blob} blob Blob to be downloaded.
 * @param {string} filename Filename.
 */
function downloadFile(blob, filename) {
  try {
    const url = URL.createObjectURL(blob);

    const dl = document.createElement('a');
    dl.setAttribute('href', url);
    dl.setAttribute('download', filename);
    dl.click();
  } catch (e) {
    console.error('Could not save file, e: ' + e);
  }
}
