import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login } from '../store/slices/authSlice';
import { AppButton } from '../components/AppButton';

// Don't worry, this is just for the demo ;)
const DEMO_EMAIL    = 'ana@example.com';
const DEMO_PASSWORD = 'password123';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loading, error } = useAppSelector(s => s.auth);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) navigate('/dashboard');
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="bg-surface p-8 rounded-lg shadow-sm border border-neutral-200 w-full max-w-sm">
        <h1 className="text-heading-md text-neutral-900 mb-6">{t('login.title')}</h1>

        {/* Demo credentials hint */}
        <div className="mb-5 rounded-lg border border-warning-base bg-warning-subtle px-4 py-3">
          <p className="text-body-sm font-semibold text-warning-base mb-1">
            🤫 {t('login.demoHint')}
          </p>
          <p className="text-caption text-neutral-700 font-mono mb-0.5">{DEMO_EMAIL}</p>
          <p className="text-caption text-neutral-700 font-mono mb-2">{DEMO_PASSWORD}</p>
          <button
            type="button"
            onClick={fillDemo}
            className="text-caption font-semibold text-brand-primary hover:underline"
          >
            {t('login.demoFill')} →
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-body-sm text-neutral-700 block mb-1">{t('login.email')}</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="text-body-sm text-neutral-700 block mb-1">{t('login.password')}</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-brand-primary"
            />
          </div>
          {error && <p className="text-body-sm text-error-base">{error}</p>}
          <AppButton type="submit" variant="primary" loading={loading} className="w-full">
            {t('login.submit')}
          </AppButton>
        </form>
      </div>
    </div>
  );
}

