import { useTranslation } from 'react-i18next';
import type { GoalProgress, AchievementStatus } from '../../types';
import { ProgressCard } from '../../components/ProgressCard';
import { AchievementsPanel } from '../../components/AchievementsPanel';
import { StatsPanel } from '../../components/StatsPanel';
import { SkeletonCard } from '../../components/Skeleton';

interface HistoryTabProps {
  allGoals: GoalProgress[];
  pastGoals: GoalProgress[];
  loading: boolean;
  achievements: AchievementStatus[];
  achievementsLoading: boolean;
}

export function PassedGoals({ allGoals, pastGoals, loading, achievements, achievementsLoading }: HistoryTabProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-6 items-start">

      {/* Left column — Past Goals */}
      <div className="bg-surface rounded-lg border border-neutral-200 p-6">
        <h2 className="text-heading-sm text-neutral-700 mb-4">{t('history.title')}</h2>

        {loading && (
          <div className="flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && pastGoals.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-heading-sm text-neutral-400 mb-1">{t('history.empty')}</p>
            <p className="text-body-sm text-neutral-500">{t('history.emptyHint')}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {pastGoals.map(goal => (
            <ProgressCard
              key={goal.goalId}
              title={goal.title}
              current={goal.total}
              target={goal.target}
              percentage={goal.percentage}
              type={goal.type}
              unitLabel={goal.unit_label}
              isActive={false}
              startDate={goal.start_date}
              endDate={goal.end_date}
            />
          ))}
        </div>
      </div>

      {/* Right column — Achievements + Stats stacked */}
      <div className="flex flex-col gap-6">
        <AchievementsPanel achievements={achievements} loading={achievementsLoading} />
        <StatsPanel allGoals={allGoals} pastGoals={pastGoals} />
      </div>

    </div>
  );
}
