import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import english from './translations/en.json';

const resources = {
  en: { translation: english },
};

i18n
  .use(initReactI18next)
  // .init options: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
