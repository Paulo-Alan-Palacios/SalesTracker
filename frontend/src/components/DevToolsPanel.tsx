import { useState } from 'react';
import api from '../services/api';
import { AppButton } from './AppButton';
import { useAppSelector } from '../store/hooks';

interface TestResult {
  scenario: string;
  status: number | 'network';
  code?: string;
  error?: string;
  timestamp: string;
}

interface Scenario {
  label: string;
  description: string;
  run: () => Promise<void>;
}

export function DevToolsPanel() {
  if (!import.meta.env.DEV) return null;

  const { user } = useAppSelector(s => s.auth);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function addResult(result: TestResult) {
    setResults(prev => [result, ...prev].slice(0, 20));
  }

  async function runScenario(label: string, fn: () => Promise<void>) {
    setLoadingId(label);
    try {
      await fn();
    } finally {
      setLoadingId(null);
    }
  }

  function capture(scenario: string) {
    return async (promise: Promise<unknown>) => {
      try {
        await promise;
        addResult({ scenario, status: 200, timestamp: new Date().toLocaleTimeString() });
      } catch (err: unknown) {
        const e = err as { response?: { status: number; data?: { error?: string; code?: string } } };
        if (e?.response) {
          addResult({
            scenario,
            status: e.response.status,
            code: e.response.data?.code,
            error: e.response.data?.error,
            timestamp: new Date().toLocaleTimeString(),
          });
        } else {
          addResult({ scenario, status: 'network', error: 'Network error / no response', timestamp: new Date().toLocaleTimeString() });
        }
      }
    };
  }

  const userId = user?.id ?? 1;

  const scenarios: Scenario[] = [
    {
      label: '401 — Wrong password',
      description: 'POST /auth/login with correct email but wrong password',
      run: async () => capture('401 Wrong password')(
        api.post('/auth/login', { email: 'ana@example.com', password: 'wrongpassword' })
      ),
    },
    {
      label: '401 — Non-existent user',
      description: 'POST /auth/login with an email that does not exist',
      run: async () => capture('401 Non-existent user')(
        api.post('/auth/login', { email: 'nobody@nowhere.com', password: 'password123' })
      ),
    },
    {
      label: '400 — Login missing fields',
      description: 'POST /auth/login with empty body',
      run: async () => capture('400 Login missing fields')(
        api.post('/auth/login', {})
      ),
    },
    {
      label: '400 — Login invalid email',
      description: 'POST /auth/login with a non-email string',
      run: async () => capture('400 Login invalid email')(
        api.post('/auth/login', { email: 'not-an-email', password: 'password123' })
      ),
    },
    {
      label: '401 — No token (create sale)',
      description: 'POST /ventas without Authorization header',
      run: async () => {
        const saved = localStorage.getItem('token');
        localStorage.removeItem('token');
        await capture('401 No token')(
          api.post('/ventas', { amount: 100, date: '2026-04-04' })
        );
        if (saved) localStorage.setItem('token', saved);
      },
    },
    {
      label: '401 — Tampered token (create sale)',
      description: 'POST /ventas with a malformed JWT',
      run: async () => capture('401 Tampered token')(
        api.post('/ventas', { amount: 100, date: '2026-04-04' }, {
          headers: { Authorization: 'Bearer this.is.not.a.valid.jwt' },
        })
      ),
    },
    {
      label: '400 — Sale missing amount',
      description: 'POST /ventas without the required amount field',
      run: async () => capture('400 Sale missing amount')(
        api.post('/ventas', { date: '2026-04-04' })
      ),
    },
    {
      label: '400 — Sale negative amount',
      description: 'POST /ventas with amount = -50',
      run: async () => capture('400 Sale negative amount')(
        api.post('/ventas', { amount: -50, date: '2026-04-04' })
      ),
    },
    {
      label: '400 — Sale invalid date format',
      description: 'POST /ventas with date = "not-a-date"',
      run: async () => capture('400 Sale invalid date')(
        api.post('/ventas', { amount: 100, date: 'not-a-date' })
      ),
    },
    {
      label: '404 — Sales history, ghost user',
      description: `GET /ventas/999999 — user ID that does not exist`,
      run: async () => capture('404 Sales history ghost user')(
        api.get('/ventas/999999')
      ),
    },
    {
      label: '404 — Progress, ghost user',
      description: 'GET /progreso/999999 — user ID that does not exist',
      run: async () => capture('404 Progress ghost user')(
        api.get('/progreso/999999')
      ),
    },
    {
      label: '200 — Progress own user (sanity check)',
      description: `GET /progreso/${userId} — should succeed`,
      run: async () => capture(`200 Progress user ${userId}`)(
        api.get(`/progreso/${userId}`)
      ),
    },
  ];

  const statusColor = (s: number | 'network') => {
    if (s === 'network') return 'text-warning-base';
    if (s >= 200 && s < 300) return 'text-success-base';
    if (s === 400) return 'text-warning-base';
    return 'text-error-base';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-neutral-900 text-white text-caption font-semibold px-3 py-1.5 rounded-md opacity-70 hover:opacity-100 transition-opacity"
      >
        {open ? '✕ Close DevTools' : '🛠 DevTools'}
      </button>

      {open && (
        <div className="mt-2 bg-surface border border-neutral-300 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-neutral-900 px-4 py-2">
            <p className="text-white text-body-sm font-semibold">API Error Scenarios</p>
            <p className="text-neutral-400 text-caption">DEV only — triggers intentionally bad requests</p>
          </div>

          {/* Scenario buttons */}
          <div className="divide-y divide-neutral-200 max-h-64 overflow-y-auto">
            {scenarios.map(s => (
              <div key={s.label} className="px-3 py-2 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-neutral-700 leading-tight">{s.label}</p>
                  <p className="text-caption text-neutral-500 truncate">{s.description}</p>
                </div>
                <AppButton
                  variant="ghost"
                  size="sm"
                  loading={loadingId === s.label}
                  onClick={() => runScenario(s.label, s.run)}
                  className="shrink-0 text-caption px-2 py-1"
                >
                  Run
                </AppButton>
              </div>
            ))}
          </div>

          {/* Results log */}
          {results.length > 0 && (
            <div className="border-t border-neutral-200 bg-neutral-100 max-h-48 overflow-y-auto">
              <div className="flex justify-between items-center px-3 py-1.5 border-b border-neutral-200">
                <p className="text-caption font-semibold text-neutral-500">Results</p>
                <button onClick={() => setResults([])} className="text-caption text-neutral-400 hover:text-neutral-700">Clear</button>
              </div>
              {results.map((r, i) => (
                <div key={i} className="px-3 py-1.5 border-b border-neutral-200 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-caption font-bold ${statusColor(r.status)}`}>{r.status}</span>
                    <span className="text-caption text-neutral-700 font-medium truncate">{r.scenario}</span>
                    <span className="text-caption text-neutral-400 ml-auto shrink-0">{r.timestamp}</span>
                  </div>
                  {(r.code ?? r.error) && (
                    <p className="text-caption text-neutral-500 pl-6 truncate">
                      {r.code && <span className="font-mono text-warning-base">{r.code}</span>}
                      {r.code && r.error && ' — '}
                      {r.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
