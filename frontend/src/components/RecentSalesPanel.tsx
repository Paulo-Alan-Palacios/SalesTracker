import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Sale } from '../types';
import { SkeletonRow } from './Skeleton';

interface RecentSalesPanelProps {
  sales: Sale[];
  loading: boolean;
}

function formatValue(sale: Sale, unitLabel: string) {
  return sale.type === 'units'
    ? `${sale.value.toLocaleString()} ${unitLabel}`
    : `$${sale.value.toLocaleString()}`;
}

function SaleRow({ sale, unitLabel, saleLabel }: { sale: Sale; unitLabel: string; saleLabel: string }) {
  return (
    <div className="rounded-md border border-neutral-200 px-4 py-3 flex justify-between items-center">
      <div>
        <p className="text-body-md text-neutral-900">{sale.description ?? saleLabel}</p>
        <p className="text-caption text-neutral-500">{sale.date}</p>
      </div>
      <span className="text-heading-sm text-success-base font-semibold">
        {formatValue(sale, unitLabel)}
      </span>
    </div>
  );
}

export function RecentSalesPanel({ sales, loading }: RecentSalesPanelProps) {
  const { t } = useTranslation();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todaySales  = sales.filter(s => s.date === today);
  const pastSales   = sales.filter(s => s.date !== today).slice(0, 8);

  const todayMonetary = todaySales.filter(s => s.type === 'monetary').reduce((acc, s) => acc + s.value, 0);
  const todayUnits    = todaySales.filter(s => s.type === 'units').reduce((acc, s) => acc + s.value, 0);

  const unitLabel = t('dashboard.units');
  const saleLabel = t('dashboard.sale');

  return (
    <div className="bg-surface rounded-lg border border-neutral-200 p-6">
      <h2 className="text-heading-sm text-neutral-700 mb-4">{t('dashboard.recentSales')}</h2>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
        </div>
      )}

      {!loading && sales.length === 0 && (
        <div className="py-6 text-center">
          <p className="text-heading-sm text-neutral-400 mb-1">{t('dashboard.noSalesYet')}</p>
          <p className="text-body-sm text-neutral-500">{t('dashboard.noSalesYetHint')}</p>
        </div>
      )}

      {!loading && sales.length > 0 && (
        <div className="flex flex-col gap-5">

          {/* Today's sales */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption font-semibold text-neutral-400 uppercase tracking-wider">
                {t('dashboard.todaySales')}
              </span>
              {todaySales.length > 0 && (
                <span className="text-caption font-semibold text-neutral-500">
                  {t('dashboard.todayTotal')}:
                  {todayMonetary > 0 && <span className="text-success-base ml-1">${todayMonetary.toLocaleString()}</span>}
                  {todayMonetary > 0 && todayUnits > 0 && <span className="mx-1 text-neutral-300">·</span>}
                  {todayUnits > 0 && <span className="text-success-base ml-1">{todayUnits.toLocaleString()} {unitLabel}</span>}
                </span>
              )}
            </div>

            {todaySales.length === 0 ? (
              <p className="text-body-sm text-neutral-400 italic py-2">{t('dashboard.todaySalesEmpty')}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {todaySales.map(sale => (
                  <SaleRow key={sale.id} sale={sale} unitLabel={unitLabel} saleLabel={saleLabel} />
                ))}
              </div>
            )}
          </div>

          {/* Previous sales */}
          {pastSales.length > 0 && (
            <div>
              <span className="text-caption font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                {t('dashboard.recentSalesOther')}
              </span>
              <div className="flex flex-col gap-2">
                {pastSales.map(sale => (
                  <SaleRow key={sale.id} sale={sale} unitLabel={unitLabel} saleLabel={saleLabel} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
