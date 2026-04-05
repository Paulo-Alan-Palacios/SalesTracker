import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { GoalProgress, Sale, AchievementStatus } from '../../types';
import { ProgressCard } from '../../components/ProgressCard';
import { AchievementsPanel } from '../../components/AchievementsPanel';
import { RecentSalesPanel } from '../../components/RecentSalesPanel';
import { SkeletonCard } from '../../components/Skeleton';
import { AppButton } from '../../components/AppButton';

interface DashboardTabProps {
  activeGoals: GoalProgress[];
  sales: Sale[];
  progressLoading: boolean;
  salesLoading: boolean;
  achievements: AchievementStatus[];
  achievementsLoading: boolean;
}

export function ActiveGoals({ activeGoals, sales, progressLoading, salesLoading, achievements, achievementsLoading }: DashboardTabProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-6 items-start">

      {/* Left column — Active Goals, spans both right rows */}
      <div className="row-span-2 bg-surface rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-sm text-neutral-700">{t('dashboard.activeGoals')}</h2>
          <Link to="/ventas/nueva">
            <AppButton variant="primary" size="sm">{t('header.registerSale')}</AppButton>
          </Link>
        </div>

        {progressLoading && (
          <div className="flex flex-col gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!progressLoading && activeGoals.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-heading-sm text-neutral-400 mb-1">{t('dashboard.noActiveGoals')}</p>
            <p className="text-body-sm text-neutral-500">{t('dashboard.noActiveGoalsHint')}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!progressLoading && activeGoals.map(goal => (
            <ProgressCard
              key={goal.goalId}
              title={goal.title}
              current={goal.total}
              target={goal.target}
              percentage={goal.percentage}
              type={goal.type}
              unitLabel={goal.unit_label}
              isActive={true}
              startDate={goal.start_date}
              endDate={goal.end_date}
            />
          ))}
        </div>
      </div>

      {/* Top-right — Achievements */}
      <AchievementsPanel achievements={achievements} loading={achievementsLoading} />

      {/* Bottom-right — Recent Sales */}
      <RecentSalesPanel sales={sales} loading={salesLoading} />

    </div>
  );
}
