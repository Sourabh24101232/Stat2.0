import { useTranslation } from 'react-i18next'

const HelpCenter = () => (
  <main className="mx-auto max-w-3xl px-6 py-20 text-gray-600 dark:text-gray-300 md:py-28">
    <LocalizedHelp />
  </main>
)

const LocalizedHelp = () => {
  const { t } = useTranslation('common')
  return <><h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{t('pages.helpTitle')}</h1><p className="mt-6 leading-7">{t('pages.helpText')}</p></>
}

export default HelpCenter
