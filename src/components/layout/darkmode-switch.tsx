import type { ColorScheme } from '@/contexts/darkmode';
import { useDarkMode, useSetDarkMode } from '@/contexts/darkmode';
import { memo, useCallback, useId } from 'react';
import * as stylex from '@stylexjs/stylex';
import IconSun from '../icons/sun';
import IconMoon from '../icons/moon';
import IconDisplay from '../icons/display';
import IconChevronUpDown from '../icons/chevron-up-down';
import { clsx } from 'clsx';

const styles = stylex.create({
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
    left: {
      default: '6px',
      '@media (min-width: 840px)': '12px'
    }
  },
  icon_wrapper_suffix: {
    right: {
      default: '6px',
      '@media (min-width: 840px)': '12px'
    }
  },
  icon: {
    width: {
      default: '14px',
      '@media (min-width: 840px)': '16px'
    },
    height: {
      default: '14px',
      '@media (min-width: 840px)': '16px'
    }
  },
  select: {
    paddingLeft: {
      default: '24px',
      '@media (min-width: 840px)': '36px'
    },
    paddingRight: {
      default: '24px',
      '@media (min-width: 840px)': '36px'
    },
    fontSize: '14px',
    height: '32px',
    cursor: 'pointer',
    appearance: 'none',
    lineHeight: 1.5,
    width: '100%',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-primary)'
  },
  dark_hack: {
    display: 'none'
  }
});

const DarkModeIcon = memo((props: { mode: ColorScheme }) => {
  if (props.mode === 'light') {
    return <IconSun {...stylex.props(styles.icon)} />;
  }
  if (props.mode === 'dark') {
    return <IconMoon {...stylex.props(styles.icon)} />;
  }
  return <IconDisplay {...stylex.props(styles.icon)} />;
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
      <div
        {...stylex.props(styles.dark_hack)}
        className={clsx(stylex.props(styles.dark_hack).className, 'dark')}
      />
      <label htmlFor={id}>
        <div {...stylex.props(styles.container)}>
          <span {...stylex.props(styles.icon_wrapper, styles.icon_wrapper_prefix)}>
            <DarkModeIcon mode={darkMode} />
          </span>
          <select {...stylex.props(styles.select)} id={id} value={darkMode} onChange={handleSelectChange}>
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
          <span {...stylex.props(styles.icon_wrapper, styles.icon_wrapper_suffix)}>
            <IconChevronUpDown {...stylex.props(styles.icon)} />
          </span>
        </div>
      </label>
    </div>
  );
}

export default memo(DarkModeSwitch);
