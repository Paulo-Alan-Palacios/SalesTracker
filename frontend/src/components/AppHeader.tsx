import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import { AppButton } from './AppButton';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  labelOff: string;
  labelOn: string;
}

function ToggleSwitch({ checked, onChange, labelOff, labelOn }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-body-sm w-14 text-right ${!checked ? 'font-semibold text-neutral-900' : 'text-neutral-400'}`}>
        {labelOff}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
          checked ? 'bg-brand-primary' : 'bg-neutral-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-body-sm w-14 ${checked ? 'font-semibold text-neutral-900' : 'text-neutral-400'}`}>
        {labelOn}
      </span>
    </div>
  );
}

function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isSpanish = i18n.language === 'es';

  function toggleLanguage() {
    const next = isSpanish ? 'en' : 'es';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  }

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onOutsideClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onOutsideClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Settings"
        aria-expanded={open}
        className={`w-8 h-8 flex items-center justify-center rounded-md border transition-colors ${
          open
            ? 'border-brand-primary text-brand-primary bg-brand-primary/10'
            : 'border-neutral-200 text-neutral-500 hover:border-brand-primary hover:text-brand-primary'
        }`}
      >
        ⚙️
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-neutral-200 rounded-xl shadow-lg p-4 flex flex-col gap-4 z-50">
          <div className="flex flex-col gap-2">
            <span className="text-caption text-neutral-400 uppercase tracking-wider font-semibold">Language</span>
            <ToggleSwitch
              checked={isSpanish}
              onChange={toggleLanguage}
              labelOff="🇺🇸 EN"
              labelOn="🇲🇽 ES"
            />
          </div>

          <div className="border-t border-neutral-100" />

          <div className="flex flex-col gap-2">
            <span className="text-caption text-neutral-400 uppercase tracking-wider font-semibold">Theme</span>
            <ToggleSwitch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              labelOff="☀️ Light"
              labelOn="🌙 Dark"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function AppHeader() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  return (
    <header className="bg-surface border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="text-heading-sm text-brand-primary font-semibold tracking-tight">
        Cody Sales Tracker =)
      </Link>
      <div className="flex items-center gap-3">
        <SettingsDropdown />
        <AppButton variant="ghost" size="sm" onClick={handleLogout}>
          {t('header.logout')}
        </AppButton>
      </div>
    </header>
  );
}

