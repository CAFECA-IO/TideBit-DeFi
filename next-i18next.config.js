const path = require('path');

const i18nConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['tw', 'en', 'cn'],
  },
  localePath: path.resolve('./src/locales'),
};

module.exports = i18nConfig;
