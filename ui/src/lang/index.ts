import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getLanguage } from '@/utils/cookies'

// element-ui built-in lang
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementTwLocale from 'element-ui/lib/locale/lang/zh-TW'
import elementIdLocale from 'element-ui/lib/locale/lang/id'
import elementViLocale from 'element-ui/lib/locale/lang/vi'

// User defined lang
import enLocale from './en'
import twLocale from './tw'
import idLocale from './id'
import viLocale from './vi'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  tw: {
    ...twLocale,
    ...elementTwLocale
  },
  id: {
    ...idLocale,
    ...elementIdLocale
  },
  vi: {
    ...viLocale,
    ...elementViLocale
  }
}

export const getLocale = () => {
  const cookieLanguage = getLanguage()
  if (cookieLanguage) {
    document.documentElement.lang = cookieLanguage
    return cookieLanguage
  }

  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      document.documentElement.lang = locale
      return locale
    }
  }

  // Default language is chinese
  return 'tw'
}

const i18n = new VueI18n({
  locale: getLocale(),
  messages,
  silentTranslationWarn: true
})

export default i18n
