import { createContext, useCallback, useContext, useState } from 'react';

import { noop } from '@/lib/shared/util';
import { requestIdleCallback } from '@/lib/client/request-idle-callback';
import useLayoutEffect from '../hooks/use-isomorphic-effect';

const darkModeStorageKey = 'user-color-scheme';

export type ColorScheme = 'light' | 'dark' | 'auto';

const getInitialThemeValue = (): ColorScheme => {
  try {
    if (typeof window === 'object') {
      return localStorage.getItem(darkModeStorageKey) as ColorScheme | null || 'auto';
    }
    return 'auto';
  } catch {
    return 'auto';
  }
};

const updateThemeToDom = (theme: ColorScheme) => {
  if (typeof window === 'object') {
    const rootEl = document.documentElement;
    if (theme === 'dark') {
      rootEl.classList.remove('light');
      rootEl.classList.add('dark');
    } else if (theme === 'light') {
      rootEl.classList.remove('dark');
      rootEl.classList.add('light');
    } else {
      rootEl.classList.remove('dark', 'light');
    }
  }
};

const initialThemeValue = getInitialThemeValue();
updateThemeToDom(initialThemeValue);

const DarkModeContext = createContext<ColorScheme>('auto');
const DarkModeDispatchContext = createContext<React.Dispatch<React.SetStateAction<ColorScheme>>>(noop);

export const useDarkMode = () => useContext(DarkModeContext);
export const useSetDarkMode = () => {
  const setDarkMode = useContext(DarkModeDispatchContext);

  return useCallback((newMode: ColorScheme) => {
    setDarkMode(newMode);
    if (typeof window === 'object') {
      updateThemeToDom(newMode);

      // eslint-disable-next-line @fluffyfox/prefer-timer-id -- update localStorage is slow, hang the job
      requestIdleCallback(() => {
        try {
          if (newMode === 'auto') {
            localStorage.removeItem(darkModeStorageKey);
          } else {
            localStorage.setItem(darkModeStorageKey, newMode);
          }
        } catch { }
      });
    }
  }, [setDarkMode]);
};

export const DarkModeProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  // We are showing the current theme value directly in the initial DOM (in a <select>)
  // There could be a mismatch between server (always auto) and client (custom settings)
  // So we render 'auto' first, then use layout effect to update the correct client settings (DOM not commit yet)
  const [theme, setTheme] = useState<ColorScheme>('auto');
  useLayoutEffect(() => {
    setTheme(initialThemeValue);
  }, []);

  return (
    <DarkModeContext.Provider value={theme}>
      <DarkModeDispatchContext.Provider value={setTheme}>
        {children}
      </DarkModeDispatchContext.Provider>
    </DarkModeContext.Provider>
  );
};
