import { createContext, startTransition, useCallback, use, useEffect, useState } from 'react';

import { noop } from 'foxact/noop';
import { requestIdleCallback } from 'foxact/request-idle-callback';

const darkModeStorageKey = 'user-color-scheme';

export type ColorScheme = 'light' | 'dark' | 'auto';

function getInitialThemeValue(): ColorScheme {
  try {
    if (typeof window === 'object') {
      return localStorage.getItem(darkModeStorageKey) as ColorScheme | null || 'auto';
    }
    return 'auto';
  } catch {
    return 'auto';
  }
}

function updateThemeToDom(theme: ColorScheme) {
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
}

const initialThemeValue = getInitialThemeValue();
updateThemeToDom(initialThemeValue);

const DarkModeContext = createContext<ColorScheme>('auto');
const DarkModeDispatchContext = createContext<React.Dispatch<React.SetStateAction<ColorScheme>>>(noop);

export const useDarkMode = () => use(DarkModeContext);
export function useSetDarkMode() {
  const setDarkMode = use(DarkModeDispatchContext);

  return useCallback((newMode: ColorScheme) => {
    setDarkMode(newMode);
    if (typeof window === 'object') {
      updateThemeToDom(newMode);

      // eslint-disable-next-line sukka/prefer-timer-id -- update localStorage is slow, hang the job
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
}

export function DarkModeProvider({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = useState<ColorScheme>('auto');

  // We are showing the current theme value directly in the initial DOM (in a <select>)
  // There could be a mismatch between server (always auto) and client (custom settings)
  // So we render 'auto' first, then use layout effect to update the correct client settings (DOM not commit yet)
  useEffect(() => {
    startTransition(() => setTheme(initialThemeValue));
  }, []);

  return (
    <DarkModeContext value={theme}>
      <DarkModeDispatchContext value={setTheme}>
        {children}
      </DarkModeDispatchContext>
    </DarkModeContext>
  );
}
