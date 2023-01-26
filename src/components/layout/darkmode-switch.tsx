import type { ColorScheme } from '@/contexts/darkmode';
import { useDarkMode, useSetDarkMode } from '@/contexts/darkmode';
import { memo, useCallback, useId } from 'react';
import style9 from 'style9';
import IconSun from '../icons/sun';
import IconMoon from '../icons/moon';
import IconDisplay from '../icons/display';
import IconChevronUpDown from '../icons/chevron-up-down';
import clsx from 'clsx';

const styles = style9.create({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-primary)'
  },
  icon_wrapper: {
    display: 'inline-flex',
    position: 'absolute',
    pointerEvents: 'none',
    color: 'var(--text-primary)'
  },
  icon_wrapper_prefix: {
    left: '6px',
    '@media screen and (min-width: 840px)': {
      left: '12px'
    }
  },
  icon_wrapper_suffix: {
    right: '6px',
    '@media screen and (min-width: 840px)': {
      right: '12px'
    }
  },
  icon: {
    width: '14px',
    height: '14px',
    '@media screen and (min-width: 840px)': {
      width: '16px',
      height: '16px'
    }
  },
  select: {
    paddingLeft: '24px',
    paddingRight: '24px',
    '@media screen and (min-width: 840px)': {
      paddingLeft: '36px',
      paddingRight: '36px'
    },
    fontSize: '14px',
    height: '32px',
    cursor: 'pointer',
    appearance: 'none',
    lineHeight: 1.5,
    width: '100%',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-primary)'
  },
  dark_hack: {
    display: 'none'
  }
});

const DarkModeIcon = memo((props: { mode: ColorScheme }) => {
  if (props.mode === 'light') {
    return <IconSun className={styles('icon')} />;
  }
  if (props.mode === 'dark') {
    return <IconMoon className={styles('icon')} />;
  }
  return <IconDisplay className={styles('icon')} />;
});

function DarkModeSwitch() {
  const id = useId();
  const darkMode = useDarkMode();
  const setDarkMode = useSetDarkMode();

  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setDarkMode(e.target.value as ColorScheme);
  }, [setDarkMode]);

  return (
    <div>
      {/**
        * Add a hidden element with className being "dark".
        * This prevents critter from excluding .dark variable from inline css.
        */}
      <div className={clsx(styles('dark_hack'), 'dark')} />
      <label htmlFor={id}>
        <div className={styles('container')}>
          <span className={styles('icon_wrapper', 'icon_wrapper_prefix')}>
            <DarkModeIcon mode={darkMode} />
          </span>
          <select className={styles('select')} id={id} value={darkMode} onChange={handleSelectChange}>
            <option value="light">
              Light
            </option>
            <option value="dark">
              Dark
            </option>
            <option value="auto">
              System
            </option>
          </select>
          <span className={styles('icon_wrapper', 'icon_wrapper_suffix')}>
            <IconChevronUpDown className={styles('icon')} />
          </span>
        </div>
      </label>
    </div>
  );
}

export default memo(DarkModeSwitch);
