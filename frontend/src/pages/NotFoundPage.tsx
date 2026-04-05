import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../components/AppButton';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-4">
      <p className="text-heading-lg text-neutral-400">{t('notFound.code')}</p>
      <h1 className="text-heading-md text-neutral-900">{t('notFound.title')}</h1>
      <p className="text-body-md text-neutral-500">{t('notFound.message')}</p>
      <Link to="/dashboard">
        <AppButton variant="primary">{t('notFound.goToDashboard')}</AppButton>
      </Link>
    </div>
  );
}
