/**
 * @typedef {object} Config
 * @property {string} ENV - the environment this frontend is build for
 * @property {string} LOCALE_DEFAULT - The default location
 */

/** @type {Config} from webpack define plugin */
const config = {
  ...ENV_CONFIG,

  get isProd() {
    return this.ENV === 'prod';
  },
};

export default config;
