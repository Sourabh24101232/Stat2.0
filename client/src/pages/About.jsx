import { useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation('common')
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-gray-600 dark:text-gray-300 md:py-28">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{t('pages.aboutTitle')}</h1>
      <p className="mt-6 leading-7">
        {t('pages.aboutFirst')}
      </p>
      <p className="mt-4 leading-7">
        {t('pages.aboutSecond')}
      </p>
    </main>
  )
}

export default About
