import { useCallback, useMemo } from 'react';
import { translate } from '../i18n';
import { useApp } from '../context/AppContext';
import type { AppLanguage } from '../types';

export function useTranslation() {
  const { settings } = useApp();
  const lang = settings.appLanguage;

  const t = useCallback(
    (key: string, params?: Record<string, string>) => translate(lang, key, params),
    [lang]
  );

  const prayer = useCallback(
    (name: string) => translate(lang, `prayer.${name}`),
    [lang]
  );

  return useMemo(
    () => ({ t, prayer, appLanguage: lang as AppLanguage }),
    [t, prayer, lang]
  );
}
