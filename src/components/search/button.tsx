import style9 from 'style9';
import IconSearch from '../icons/search';
import { useCallback } from 'react';
import { useSetSearchOpen } from '../../contexts/search';

const styles = style9.create({
  kbd: {
    height: '20px',
    width: '20px',
    border: '1px solid transparent',
    marginRight: '4px',
    backgroundColor: 'var(--bg-wash)',
    color: 'var(--text-shallow)',
    verticalAlign: 'middle',
    padding: 0,
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
    display: 'inline-flex',
    alignItems: 'center',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
    marginLeft: '8px',
    marginRight: '8px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-wash)',
    '@media screen and (min-width: 840px)': {
      display: 'none'
    },
    ':hover': {
      backgroundColor: 'var(--bg-hover)'
    }
  },
  search_button_in_sidenav: {
    display: 'none',
    '@media screen and (min-width: 840px)': {
      display: 'flex'
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
    outline: 'none',
    ':focus': {
      outline: 'none'
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

function Kbd(props: JSX.IntrinsicElements['kbd']) {
  return (
    <kbd
      className={styles('kbd')}
      {...props}
    />
  );
}

export function SearchButtonOnMobile() {
  const setSearchOpen = useSetSearchOpen();
  const handleOpen = useCallback(() => {
    setSearchOpen(true);
  }, [setSearchOpen]);

  return (
    <button
      aria-label="Search"
      type="button"
      className={styles('search_button_on_mobile')}
      onClick={handleOpen}
    >
      <IconSearch className={styles('icon_as_button')} />
    </button>
  );
}

export function SearchButtonInSideNav() {
  const setSearchOpen = useSetSearchOpen();
  const handleOpen = useCallback(() => {
    setSearchOpen(true);
  }, [setSearchOpen]);

  return (
    <button
      className={styles('search_button_in_sidenav')}
      onClick={handleOpen}
    >
      <IconSearch className={styles('icon_in_button')} />
      Search
      <span className={styles('suffix')}>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}
