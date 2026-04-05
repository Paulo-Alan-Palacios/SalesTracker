import { useTranslation } from 'react-i18next';
import type { AchievementStatus } from '../types';
import { BadgeAchievement } from './BadgeAchievement';
import { ACHIEVEMENT_ICONS } from '../constants/achievements';

interface AchievementsPanelProps {
  achievements: AchievementStatus[];
  loading: boolean;
}

export function AchievementsPanel({ achievements, loading }: AchievementsPanelProps) {
  const { t } = useTranslation();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const total         = achievements.length;

  return (
    <div className="bg-surface rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heading-sm text-neutral-700">{t('achievements.title')}</h2>
        {!loading && total > 0 && (
          <span className="text-caption text-neutral-500 font-semibold">
            {t('achievements.unlockedCount', { unlocked: unlockedCount, total })}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex flex-col gap-3 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-3 mt-4">
          {achievements.map(a => (
            <BadgeAchievement
              key={a.id}
              name={t(`achievements.names.${a.key}`, { defaultValue: a.name })}
              description={t(`achievements.descriptions.${a.key}`)}
              icon={ACHIEVEMENT_ICONS[a.id] ?? '🏅'}
              unlocked={a.unlocked}
              achievedAt={a.achieved_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
