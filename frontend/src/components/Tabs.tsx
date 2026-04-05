import { useState } from 'react';
import type { ReactNode } from 'react';

export interface TabItem {
  name: string;
  component: ReactNode;
  badge?: number;
}

export interface GenericTabProps {
  keyPrefix: string;
  tabItems: TabItem[];
  defaultSelectedTabIndex?: number;
}

function validateTabIndex(index: number | undefined, length: number): number {
  if (index === undefined || index < 0 || index >= length) return 0;
  return index;
}

export function GenericTab({ keyPrefix, tabItems, defaultSelectedTabIndex }: GenericTabProps) {
  const [activeTab, setActiveTab] = useState<number>(
    validateTabIndex(defaultSelectedTabIndex, tabItems.length)
  );

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-neutral-200 mb-6">
        {tabItems.map((tab, index) => (
          <button
            key={`${keyPrefix}_${index}`}
            onClick={() => setActiveTab(index)}
            className={`px-5 py-2.5 text-body-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              index === activeTab
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.name}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`text-caption px-1.5 py-0.5 rounded-full font-semibold ${
                index === activeTab
                  ? 'bg-brand-primary text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content — all rendered, inactive hidden via CSS */}
      <div>
        {tabItems.map((tab, index) => (
          <div
            key={`${keyPrefix}_${index}_component`}
            className={index !== activeTab ? 'hidden' : ''}
          >
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
}
