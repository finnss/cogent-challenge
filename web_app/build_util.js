const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
const dev = process.env.NODE_ENV === 'development';


const defaultConfigPath = path.resolve(__dirname, 'config', 'default.json');

// TODO: Add logic for choosing config files based on environment
// const envConfigPath = path.resolve(__dirname, 'config', `${alfaEnv}.json`)
// if(!fs.existsSync(envConfigPath)) {
//     console.error(`Could not find environment configuration file ${envConfigFile}`);
// }

// Merge configs
const envConfig = {
    ...JSON.parse(fs.readFileSync(defaultConfigPath, { encoding: 'utf-8' })),
    //...JSON.parse(fs.readFileSync(envConfigPath, { encoding: 'utf-8' })),
}

const clientVersion = pkg.version;

module.exports = { dev, envConfig, clientVersion };