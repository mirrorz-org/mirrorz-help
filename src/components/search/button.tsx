import * as stylex from '@stylexjs/stylex';
import IconSearch from '../icons/search';
import { memo, useCallback, useSyncExternalStore } from 'react';
import { useSetSearchOpen } from '@/contexts/search';
import { getOS } from '@/hooks/use-os';
import { noop } from 'foxact/noop';

const styles = stylex.create({
  kbd: {
    height: '20px',
    width: 'auto',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    marginRight: '4px',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-shallow)',
    verticalAlign: 'middle',
    padding: '4px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    textAlign: 'center',
    borderRadius: '4px'
  },
  icon_as_button: {
    verticalAlign: 'middle',
    width: '14px',
    height: '14px'
  },
  search_button_on_mobile: {
    display: {
      default: 'inline-flex',
      '@media (min-width: 840px)': 'none'
    },
    alignItems: 'center',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
    marginLeft: '8px',
    marginRight: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    borderRadius: '8px',
    backgroundColor: {
      default: 'var(--bg-wash)',
      ':hover': 'var(--bg-hover)'
    }
  },
  search_button_in_sidenav: {
    display: {
      default: 'none',
      '@media (min-width: 840px)': 'flex'
    },
    color: 'var(--text-shallow)',
    width: '100%',
    position: 'relative',
    paddingLeft: '16px',
    paddingRight: '4px',
    paddingTop: '4px',
    paddingBottom: '4px',
    height: '40px',
    backgroundColor: 'var(--bg-secondary)',
    outline: {
      default: 'none',
      ':focus': 'none'
    },
    cursor: 'pointer',
    alignItems: 'center',
    textAlign: 'left',
    borderRadius: '8px',
    verticalAlign: 'middle',
    fontSize: 14
  },
  icon_in_button: {
    marginRight: '12px',
    verticalAlign: 'middle',
    color: 'var(--text-shallow)',
    width: '14px',
    height: '14px',
    flexShrink: 0
  },
  suffix: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center'
  }
});

function Kbd(props: React.JSX.IntrinsicElements['kbd']) {
  return (
    <kbd {...stylex.props(styles.kbd)} {...props} />
  );
}

export const SearchButtonOnMobile = memo(() => {
  const setSearchOpen = useSetSearchOpen();
  const handleOpen = useCallback(() => {
    setSearchOpen(true);
  }, [setSearchOpen]);

  return (
    <button
      aria-label="Search"
      type="button"
      {...stylex.props(styles.search_button_on_mobile)}
      onClick={handleOpen}
    >
      <IconSearch {...stylex.props(styles.icon_as_button)} />
    </button>
  );
});

function getControlIconClient() {
  if (typeof window === 'undefined') {
    return '\u2318';
  }
  const os = getOS();
  if (os === 'macos' || os === 'undetermined') {
    return '\u2318';
  }
  return 'Ctrl';
};
const getControlIconServer = () => '\u2318';

function SearchButtonSuffix() {
  const icon = useSyncExternalStore(
    noop,
    getControlIconClient,
    getControlIconServer
  );

  return (
    <span {...stylex.props(styles.suffix)}>
      <Kbd>{icon}</Kbd>
      <Kbd>K</Kbd>
    </span>
  );
}

export const SearchButtonInSideNav = memo(() => {
  const setSearchOpen = useSetSearchOpen();
  const handleOpen = useCallback(() => {
    setSearchOpen(true);
  }, [setSearchOpen]);

  return (
    <button
      {...stylex.props(styles.search_button_in_sidenav)}
      onClick={handleOpen}
      type="button"
    >
      <IconSearch {...stylex.props(styles.icon_in_button)} />
      Search
      <SearchButtonSuffix />
    </button>
  );
});
