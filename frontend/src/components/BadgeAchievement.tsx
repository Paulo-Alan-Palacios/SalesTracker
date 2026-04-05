import { useTranslation } from 'react-i18next';

interface BadgeAchievementProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  achievedAt?: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function BadgeAchievement({ name, description, icon, unlocked, achievedAt }: BadgeAchievementProps) {
  const { t } = useTranslation();
  return (
    <div className={`group relative flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
      unlocked
        ? 'border-success-base bg-success-subtle text-success-base'
        : 'border-neutral-200 bg-neutral-100 text-neutral-400'
    }`}>
      <span className="text-3xl mb-1">{icon}</span>
      <span className="text-body-sm font-semibold mt-1 text-center">{name}</span>
      <span className="text-caption mt-1">
        {unlocked
          ? achievedAt ? formatDate(achievedAt) : t('badge.unlocked')
          : t('badge.locked')}
      </span>

      {/* Hover tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-neutral-900 px-3 py-2 text-caption text-neutral-100 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 text-center">
        {description}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
      </div>
    </div>
  );
}
