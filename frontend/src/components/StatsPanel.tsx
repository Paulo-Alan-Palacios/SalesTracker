import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GoalProgress } from '../types';

interface StatsPanelProps {
  allGoals: GoalProgress[];
  pastGoals: GoalProgress[];
}

interface StatRowProps {
  color: string;
  label: string;
  count: number;
  total: number;
}

function StatRow({ color, label, count, total }: StatRowProps) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-body-sm mb-1">
        <span className="text-neutral-700 font-semibold">{label}</span>
        <span className="text-neutral-500">{count} / {total}</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** SVG donut showing what fraction of goals were completed */
function DonutChart({ completed, total, reachedLabel }: { completed: number; total: number; reachedLabel: string }) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const completionRate = total > 0 ? completed / total : 0;
  const completedArc  = circumference * completionRate;

  return (
    <div className="flex flex-col items-center my-4">
      <svg viewBox="0 0 100 100" className="w-28 h-28" aria-hidden="true">
        {/* Background track */}
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="var(--color-neutral-200)"
          strokeWidth="10"
        />
        {/* Completed arc — rotated so the arc starts at 12 o'clock.
            strokeDashoffset must be negative: positive values shift the start
            clockwise (3→6 o'clock), negative shifts counter-clockwise (3→12 o'clock). */}
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="var(--color-success-base)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${completedArc} ${circumference}`}
          strokeDashoffset={-(circumference * 0.25)}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        {/* Center label */}
        <text
          x="50" y="46"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="var(--color-neutral-900)"
        >
          {total > 0 ? Math.round(completionRate * 100) : 0}%
        </text>
        <text
          x="50" y="60"
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-neutral-500)"
        >
          {reachedLabel}
        </text>
      </svg>
    </div>
  );
}

export function StatsPanel({ allGoals, pastGoals }: StatsPanelProps) {
  const { t } = useTranslation();
  const [excludeActive, setExcludeActive] = useState(false);

  const goals     = excludeActive ? pastGoals : allGoals;
  const total     = goals.length;
  const completed = goals.filter(g => g.percentage >= 100).length;

  return (
    <div className="bg-surface rounded-lg border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heading-sm text-neutral-700">{t('stats.title')}</h2>
        <label className="flex items-center gap-2 text-caption text-neutral-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={excludeActive}
            onChange={e => setExcludeActive(e.target.checked)}
            className="accent-brand-primary w-3.5 h-3.5"
          />
          {t('stats.excludeActive')}
        </label>
      </div>

      {total === 0 ? (
        <p className="text-body-sm text-neutral-400 text-center py-6">{t('stats.noGoals')}</p>
      ) : (
        <>
          <DonutChart completed={completed} total={total} reachedLabel={t('stats.reached')} />

          <p className="text-caption text-neutral-500 text-center -mt-2 mb-4">
            {completed} {t('stats.reached')} {t('stats.of')} {total} {t('stats.goals')}
          </p>

          <div className="flex flex-col gap-3">
            <StatRow color="bg-success-base"   label={t('stats.completed')}  count={completed} total={total} />
          </div>
        </>
      )}
    </div>
  );
}
