import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import norwegian from './translations/no.json';
import english from './translations/en.json';

const resources = {
  no: { translation: norwegian },
  en: { translation: english },
};

i18n
  .use(initReactI18next)
  // .init options: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'no',
    lng: 'no',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
