const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'hi','pa'], 
  directory: path.join(__dirname, '../locales'), 
  defaultLocale: 'en', 
  queryParameter: 'lang', 
  autoReload: true, 
  updateFiles: false, // Disable writing new keys to translation files
  objectNotation: true // Enable dot notation for nested keys
});

module.exports = i18n;
