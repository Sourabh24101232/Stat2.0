import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/common.json'
import hi from './locales/hi/common.json'

const savedLanguage = localStorage.getItem('stat-language')

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      hi: { common: hi },
    },
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })

document.documentElement.lang = i18n.language.startsWith('hi') ? 'hi' : 'en'
i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language.startsWith('hi') ? 'hi' : 'en'
})

export default i18n
