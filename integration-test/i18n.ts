import i18next, {init} from 'i18next'; // Import the named export 'init'
import en from '../src/locales/en/common.json';
import cn from '../src/locales/cn/common.json';
import tw from '../src/locales/tw/common.json';

export const defaultNS = 'common';

init({
  debug: false,
  fallbackLng: 'en',
  defaultNS,
  resources: {
    en: {common: en},
    cn: {common: cn},
    tw: {common: tw},
  },
});

export default i18next;
