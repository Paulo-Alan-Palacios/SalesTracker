import { useTranslation } from 'react-i18next';
import { AppButton } from './AppButton';
import { ACHIEVEMENT_ICONS } from '../constants/achievements';
import type { AchievementStatus } from '../types';

interface AchievementModalProps {
  achievements: Pick<AchievementStatus, 'id' | 'name' | 'key'>[];
  onClose: () => void;
}

export function AchievementModal({ achievements, onClose }: AchievementModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-surface rounded-2xl shadow-2xl border border-neutral-200 p-8 w-full max-w-sm mx-4 flex flex-col items-center text-center animate-slide-up">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-heading-md text-neutral-900 mb-1">
          {t('achievements.modal.title')}
        </h2>
        <p className="text-body-sm text-neutral-500 mb-6">
          {t('achievements.modal.subtitle')}
        </p>

        <div className="flex flex-col gap-3 w-full mb-6">
          {achievements.map(a => (
            <div
              key={a.id}
              className="flex items-center gap-4 bg-success-subtle border border-success-base rounded-xl px-4 py-3"
            >
              <span className="text-3xl">{ACHIEVEMENT_ICONS[a.id] ?? '🏅'}</span>
              <span className="text-body-md font-semibold text-success-base">
                  {t(`achievements.names.${a.key}`, { defaultValue: a.name })}
                </span>
            </div>
          ))}
        </div>

        <AppButton variant="primary" onClick={onClose} className="w-full">
          {t('achievements.modal.cta')}
        </AppButton>
      </div>
    </div>
  );
}
