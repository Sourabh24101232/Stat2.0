import { useTranslation } from 'react-i18next'

const Terms = () => (
  <main className="mx-auto max-w-3xl px-6 py-20 text-gray-600 dark:text-gray-300 md:py-28">
    <LocalizedTerms />
  </main>
)

const LocalizedTerms = () => {
  const { t } = useTranslation('common')
  return <><h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{t('pages.termsTitle')}</h1><p className="mt-6 leading-7">{t('pages.termsText')}</p></>
}

export default Terms
