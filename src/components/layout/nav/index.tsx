import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';
import IconHambuger from '../../icons/hamburger';
import IconClose from '../../icons/close';
import style9 from 'style9';
import MirrorZLogo from '../../mirrorz-logo';

import Sidebar from './sidebar';
import DarkModeSwitch from '../darkmode-switch';
import { SearchButtonInSideNav, SearchButtonOnMobile } from '../../search/button';
import { useLayoutEffect } from 'foxact/use-isomorphic-layout-effect';

const styles = style9.create({
  container: {
    position: 'sticky',
    top: 0,
    '@media screen and (min-width: 840px)': {
      bottom: 0,
      height: '100vh'
    },
    display: 'flex',
    flexDirection: 'column'
  },
  container_open: {
    height: '100vh'
  },
  header: {
    alignItems: 'center',
    width: '100%',
    display: 'flex',
    zIndex: 50,
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-wash)',
    paddingTop: 0,
    paddingRight: '20px',
    borderStyle: 'solid',
    borderColor: 'var(--border-secondary)',
    '@media screen and (min-width: 840px)': {
      display: 'block',
      paddingTop: '16px',
      paddingLeft: '20px',
      paddingBottom: '16px',
      borderBottomWidth: '1px'
    }
  },
  header_open: {
    borderBottomWidth: '1px'
  },
  header_inner: {
    display: 'flex',
    alignItems: 'center',
    '@media screen and (min-width: 1280px)': {
      width: '100%',
      maxWidth: '336px'
    }
  },
  menu_button: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: '16px',
    paddingRight: '16px',
    '@media screen and (min-width: 840px)': {
      display: 'none'
    }
  },
  menu_button_open: {
    marginRight: 0
  },
  icon: {
    width: '24px',
    height: '24px'
  },
  title: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingTop: '4px',
    paddingBottom: '4px',
    marginRight: 0,
    fontSize: 20,
    flexGrow: 1,
    whiteSpace: 'nowrap',
    '@media screen and (min-width: 640px)': {
      marginRight: '12px'
    }
  },
  logo: {
    width: '24px',
    height: '24px',
    marginRight: '8px'
  },
  search_container_inside_nav: {
    display: 'none',
    '@media screen and (min-width: 840px)': {
      display: 'block',
      paddingTop: '16px'
    }
  },
  hidden_on_mobile_then_flex: {
    display: 'none',
    '@media screen and (min-width: 840px)': {
      display: 'flex'
    }
  },
  search_container_on_mobile: {
    display: 'flex',
    margin: '16px 0',
    width: '100%',
    '@media screen and (min-width: 840px)': {
      display: 'none',
      maxWidth: '384px'
    },
    justifyContent: 'flex-end'
  },
  nav_container: {
    overflowY: 'scroll',
    backgroundColor: 'var(--bg-wash)',
    flexGrow: 1,
    paddingLeft: '16px',
    '@media screen and (min-width: 840px)': {
      width: '336px',
      paddingLeft: 0
    }
  },
  aside: {
    flexDirection: 'column',
    width: '100%',
    paddingBottom: '32px',
    zIndex: 10,
    '@media screen and (min-width: 840px)': {
      display: 'flex',
      flexGrow: 1,
      paddingBottom: 0,
      maxWidth: '336px'
    }
  },
  aside_open: {
    display: 'block',
    zIndex: 40
  },
  aside_close: {
    display: 'none',
    '@media screen and (min-width: 840px)': {
      display: 'block'
    }
  },
  nav: {
    width: '100%',
    flexGrow: 1,
    paddingRight: 0,
    paddingTop: '12px',
    '@media screen and (min-width: 840px)': {
      height: 'auto',
      paddingRight: '20px',
      paddingBottom: '24px'
    }
  }
});

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(isOpen => !isOpen), []);

  const scrollParentRef = useRef<HTMLDivElement>(null);
  const asPath = useRouter().asPath;

  // While the overlay is open, disable body scroll.
  useEffect(() => {
    const preferredScrollParent = scrollParentRef.current;
    if (isOpen && preferredScrollParent) {
      disableBodyScroll(preferredScrollParent);
      return () => enableBodyScroll(preferredScrollParent);
    }
  }, [isOpen]);

  // Close the overlay on any navigation.
  useLayoutEffect(() => {
    setIsOpen(false);
  }, [asPath]);

  // Also close the overlay if the window gets resized past mobile layout.
  // (This is also important because we don't want to keep the body locked!)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 839px)');
    function closeIfNeeded() {
      if (!media.matches) {
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- missing event listener from useRouter
        setIsOpen(false);
      }
    }
    closeIfNeeded();
    media.addEventListener('change', closeIfNeeded);
    return () => {
      media.removeEventListener('change', closeIfNeeded);
    };
  }, []);

  return (
    <div className={styles('container', isOpen && 'container_open')}>
      <div className={styles('header', isOpen && 'header_open')}>
        <div className={styles('header_inner')}>
          <button
            type="button"
            aria-label="Menu"
            onClick={handleOpen}
            className={styles('menu_button', isOpen && 'menu_button_open')}
          >
            {
              isOpen
                ? <IconClose className={styles('icon')} />
                : <IconHambuger className={styles('icon')} />
            }
          </button>
          <Link href="/" className={styles('title')}>
            <MirrorZLogo className={styles('logo')} />
            {/* <Logo className="text-sm mr-2 w-8 h-8 text-link dark:text-link-dark" /> */}
            <h1>MirrorZ Help</h1>
          </Link>
          <div className={styles('hidden_on_mobile_then_flex')}>
            <DarkModeSwitch />
          </div>
        </div>
        {!isOpen && (
          <div className={styles('search_container_inside_nav')}>
            <SearchButtonInSideNav />
          </div>
        )}
        {/* <div className="px-0 pt-2 w-full 2xl:max-w-xs hidden lg:flex items-center self-center border-b-0 lg:border-b border-border dark:border-border-dark">
          <p>Tab</p>
        </div> */}
        <div className={styles('search_container_on_mobile')}>
          <SearchButtonOnMobile />
          <DarkModeSwitch />
        </div>
      </div>

      {/* isOpen && (
        <div className="bg-wash dark:bg-wash-dark px-5 flex justify-end border-b border-border dark:border-border-dark items-center self-center w-full z-10">
          <p>Tab</p>
        </div>
      ) */}

      <div
        ref={scrollParentRef}
        className={clsx('no-bg-scrollbar', styles('nav_container'))}
      >
        <aside
          className={styles('aside', isOpen ? 'aside_open' : 'aside_close')}
        >
          <nav
            role="navigation"
            className={styles('nav')}
          >
            <Sidebar />
          </nav>
        </aside>
      </div>
    </div>
  );
}

export default memo(Nav);
