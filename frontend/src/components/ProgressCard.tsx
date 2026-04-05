import { useTranslation } from 'react-i18next';
import type { GoalType } from '../types';

interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
  percentage: number;
  type: GoalType;
  unitLabel: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

function getBarColor(pct: number): string {
  if (pct >= 100) return 'bg-success-base';
  if (pct >= 80)  return 'bg-brand-primary';
  if (pct >= 50)  return 'bg-warning-base';
  return 'bg-neutral-400';
}

function formatValue(value: number, type: GoalType, unitLabel: string): string {
  if (type === 'monetary') return `$${value.toLocaleString()}`;
  return `${value.toLocaleString()} ${unitLabel}`;
}

export function ProgressCard({ title, current, target, percentage, type, unitLabel, isActive, startDate, endDate }: ProgressCardProps) {
  const { t } = useTranslation();
  const clamped = Math.min(percentage, 100);

  return (
    <div className="bg-surface rounded-lg border border-neutral-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-heading-sm text-neutral-900">{title}</h3>
        <div className="flex items-center gap-2">
          <span className={`text-caption px-2 py-0.5 rounded-full ${
            type === 'monetary'
              ? 'bg-neutral-200 text-brand-primary'
              : 'bg-neutral-200 text-brand-secondary'
          }`}>
            {type === 'monetary' ? t('progressCard.typeMoney') : t('progressCard.typeUnits')}
          </span>
          {isActive
            ? <span className="text-caption bg-success-subtle text-success-base px-2 py-0.5 rounded-full">{t('progressCard.active')}</span>
            : <span className="text-caption bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">{t('progressCard.inactive')}</span>
          }
        </div>
      </div>

      {startDate && endDate && (
        <p className="text-caption text-neutral-400 mb-3">{startDate} → {endDate}</p>
      )}

      <div className="w-full bg-neutral-200 rounded-full h-3 mb-3">
        <div
          className={`${getBarColor(percentage)} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      <div className="flex justify-between text-body-sm text-neutral-500">
        <span>{formatValue(current, type, unitLabel)} {t('progressCard.achieved')}</span>
        <span className="font-semibold text-neutral-900">{percentage.toFixed(1)}%</span>
        <span>{t('progressCard.goal')}: {formatValue(target, type, unitLabel)}</span>
      </div>
    </div>
  );
}
