import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createSale } from '../store/slices/salesSlice';
import { fetchProgress } from '../store/slices/progressSlice';
import { AppButton } from '../components/AppButton';
import { useToast } from '../components/Toast';
import type { SaleType } from '../types';

export function SalesFormPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { user } = useAppSelector(s => s.auth);

  const [saleType, setSaleType] = useState<SaleType>('monetary');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleTypeSwitch(type: SaleType): void {
    setSaleType(type);
    setValue('');
    setError(null);
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);

    const parsed = saleType === 'monetary' ? parseFloat(value) : parseInt(value, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError(saleType === 'monetary' ? t('salesForm.invalidAmount') : t('salesForm.invalidQuantity'));
      return;
    }

    setLoading(true);
    const result = await dispatch(createSale({ type: saleType, value: parsed, description: description || undefined, date }));
    setLoading(false);

    if (createSale.fulfilled.match(result)) {
      if (user) {
        // fetchProgress now returns both goals and achievements (combined endpoint)
        dispatch(fetchProgress(user.id));
      }
      showToast(t('salesForm.successToast'), 'success');
      navigate('/dashboard', {
        state: { newAchievements: result.payload.newAchievements },
      });
    } else {
      const msg = (result.payload as string) ?? t('salesForm.errorToast');
      setError(msg);
      showToast(msg, 'error');
    }
  }

  const inputClass = 'w-full border border-neutral-300 rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-brand-primary';

  return (
    <div className="min-h-screen bg-neutral-100 p-6 flex items-start justify-center">
      <div className="bg-surface rounded-lg border border-neutral-200 p-8 w-full max-w-md mt-8">
        <h1 className="text-heading-md text-neutral-900 mb-6">{t('salesForm.title')}</h1>

        {/* Sale type toggle */}
        <div className="flex rounded-md border border-neutral-200 overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => handleTypeSwitch('monetary')}
            className={`flex-1 py-2 text-body-sm font-semibold transition-colors ${
              saleType === 'monetary'
                ? 'bg-brand-primary text-white'
                : 'bg-surface text-neutral-500 hover:text-neutral-700'
            }`}
          >
            💰 {t('salesForm.typeMoney')}
          </button>
          <button
            type="button"
            onClick={() => handleTypeSwitch('units')}
            className={`flex-1 py-2 text-body-sm font-semibold transition-colors border-l border-neutral-200 ${
              saleType === 'units'
                ? 'bg-brand-primary text-white'
                : 'bg-surface text-neutral-500 hover:text-neutral-700'
            }`}
          >
            📦 {t('salesForm.typeUnits')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-body-sm text-neutral-700 block mb-1">
              {saleType === 'monetary' ? t('salesForm.amount') : t('salesForm.quantity')}
            </label>
            <input
              type="number"
              min={saleType === 'monetary' ? '0.01' : '1'}
              step={saleType === 'monetary' ? '0.01' : '1'}
              value={value}
              onChange={e => setValue(e.target.value)}
              required
              placeholder={saleType === 'monetary' ? '0.00' : '1'}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-body-sm text-neutral-700 block mb-1">{t('salesForm.description')}</label>
            <input
              type="text" value={description} onChange={e => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-body-sm text-neutral-700 block mb-1">{t('salesForm.date')}</label>
            <input
              type="date" value={date} onChange={e => setDate(e.target.value)} required
              className={inputClass}
            />
          </div>

          {error && <p className="text-body-sm text-error-base">{error}</p>}

          <div className="flex gap-3 mt-2">
            <AppButton type="button" variant="ghost" onClick={() => navigate('/dashboard')} className="flex-1">
              {t('salesForm.cancel')}
            </AppButton>
            <AppButton type="submit" variant="primary" loading={loading} className="flex-1">
              {t('salesForm.save')}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}

