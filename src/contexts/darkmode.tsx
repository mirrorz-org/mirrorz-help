import React, { createContext, useCallback, useContext, useState } from 'react';

import { noop } from '@/lib/shared/util';
import { requestIdleCallback } from '@/lib/client/request-idle-callback';

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

const DarkModeContext = createContext<ColorScheme>(initialThemeValue);
const DarkModeDispatchContext = createContext<React.Dispatch<React.SetStateAction<ColorScheme>>>(noop);

export const useDarkMode = () => useContext(DarkModeContext);
export const useSetDarkMode = () => {
  const setDarkMode = useContext(DarkModeDispatchContext);

  return useCallback((newMode: ColorScheme) => {
    setDarkMode(newMode);
    if (typeof window === 'object') {
      updateThemeToDom(newMode);

      // Update localStorage
      // eslint-disable-next-line @fluffyfox/prefer-timer-id -- hang
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
  const [theme, setTheme] = useState<ColorScheme>(initialThemeValue);

  return (
    <DarkModeContext.Provider value={theme}>
      <DarkModeDispatchContext.Provider value={setTheme}>
        {children}
      </DarkModeDispatchContext.Provider>
    </DarkModeContext.Provider>
  );
};
