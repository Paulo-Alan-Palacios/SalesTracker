import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProgress } from '../store/slices/progressSlice';
import { fetchSales } from '../store/slices/salesSlice';
import { GenericTab } from '../components/Tabs';
import type { TabItem } from '../components/Tabs';
import { AchievementModal } from '../components/AchievementModal';
import { useToast } from '../components/Toast';
import { ActiveGoals } from './tabs/DashboardTab';
import { PassedGoals } from './tabs/HistoryTab';
import type { AchievementStatus } from '../types';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { user } = useAppSelector(s => s.auth);
  // achievements now come from progress state — combined endpoint
  const { goals, achievements, loading: progressLoading, error: progressError } = useAppSelector(s => s.progress);
  const { sales, loading: salesLoading, error: salesError } = useAppSelector(s => s.sales);

  // New achievements passed via navigation state from SalesFormPage
  const locationNewAchievements =
    (location.state as { newAchievements?: Pick<AchievementStatus, 'id' | 'name' | 'key'>[] } | null)
      ?.newAchievements ?? [];

  const [modalAchievements, setModalAchievements] = useState<Pick<AchievementStatus, 'id' | 'name' | 'key'>[]>([]);

  useEffect(() => {
    if (locationNewAchievements.length > 0) {
      setModalAchievements(locationNewAchievements);
      // Clear the navigation state so the modal won't reappear on refresh
      window.history.replaceState({}, '');
    }
  }, []); // intentionally run only on mount

  useEffect(() => {
    if (user) {
      dispatch(fetchProgress(user.id));
      dispatch(fetchSales(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (progressError) showToast(t('errors.fetchProgress'), 'error');
  }, [progressError, showToast, t]);

  useEffect(() => {
    if (salesError) showToast(t('errors.fetchSales'), 'error');
  }, [salesError, showToast, t]);

  const activeGoals = goals.filter(g => g.isActive);
  const pastGoals   = goals.filter(g => !g.isActive);

  const tabs: TabItem[] = [
    {
      name: t('dashboard.tabDashboard'),
      component: (
        <ActiveGoals
          activeGoals={activeGoals}
          sales={sales}
          progressLoading={progressLoading}
          salesLoading={salesLoading}
          achievements={achievements}
          achievementsLoading={progressLoading}
        />
      ),
    },
    {
      name: t('dashboard.tabHistory'),
      badge: pastGoals.length,
      component: (
        <PassedGoals
          allGoals={goals}
          pastGoals={pastGoals}
          loading={progressLoading}
          achievements={achievements}
          achievementsLoading={progressLoading}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {modalAchievements.length > 0 && (
        <AchievementModal
          achievements={modalAchievements}
          onClose={() => setModalAchievements([])}
        />
      )}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <GenericTab keyPrefix="dashboard" tabItems={tabs} defaultSelectedTabIndex={0} />
      </div>
    </div>
  );
}
