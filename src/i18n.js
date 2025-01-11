import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 언어 파일을 import
import en from './locales/en.json';
import ko from './locales/ko.json';

i18n
  .use(initReactI18next) // react-i18next를 i18n에 연결
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    lng: 'en', // 기본 언어 설정
    fallbackLng: 'en', // 번역이 없는 경우 fallback 언어
    interpolation: {
      escapeValue: false, // react는 기본적으로 XSS 방어 처리가 되어 있어서 false로 설정
    },
  });

export default i18n;
