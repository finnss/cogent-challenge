const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
const dev = process.env.NODE_ENV === 'development';

const defaultConfigPath = path.resolve(__dirname, 'config', 'default.json');

// Merge configs
const envConfig = {
  ...JSON.parse(fs.readFileSync(defaultConfigPath, { encoding: 'utf-8' })),
};

const clientVersion = pkg.version;

module.exports = { dev, envConfig, clientVersion };
