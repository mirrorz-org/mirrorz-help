import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';
import Link from 'next/link';
import IconHambuger from '../../icons/hamburger';
import IconClose from '../../icons/close';
import * as stylex from '@stylexjs/stylex';
import MirrorZLogo from '../../mirrorz-logo';

import { useMediaQuery } from 'foxact/use-media-query';

import Sidebar from './sidebar';
import DarkModeSwitch from '../darkmode-switch';
import { SearchButtonInSideNav, SearchButtonOnMobile } from '../../search/button';

const styles = stylex.create({
  container: {
    position: 'sticky',
    top: 0,
    bottom: {
      '@media (min-width: 840px)': 0
    },
    height: {
      '@media (min-width: 840px)': '100vh'
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
    display: {
      default: 'flex',
      '@media (min-width: 840px)': 'block'
    },
    zIndex: 50,
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-wash)',
    paddingTop: {
      default: 0,
      '@media (min-width: 840px)': '16px'
    },
    paddingRight: '20px',
    paddingLeft: {
      default: 0,
      '@media (min-width: 840px)': '20px'
    },
    paddingBottom: {
      default: 0,
      '@media (min-width: 840px)': '16px'
    },
    borderStyle: 'solid',
    borderColor: 'var(--border-secondary)',
    borderBottomWidth: {
      default: 0,
      '@media (min-width: 840px)': '1px'
    }
  },
  header_open: {
    borderBottomWidth: '1px'
  },
  header_inner: {
    display: 'flex',
    alignItems: 'center',
    width: {
      default: 'auto',
      '@media (min-width: 1280px)': '100%'
    },
    maxWidth: {
      default: 'none',
      '@media (min-width: 1280px)': '336px'
    }
  },
  menu_button: {
    display: {
      default: 'flex',
      '@media (min-width: 840px)': 'none'
    },
    alignItems: 'center',
    height: '100%',
    paddingLeft: '16px',
    paddingRight: '16px'
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
    marginRight: {
      default: 0,
      '@media (min-width: 640px)': '12px'
    },
    fontSize: 20,
    flexGrow: 1,
    whiteSpace: 'nowrap'
  },
  logo: {
    width: '24px',
    height: '24px',
    marginRight: '8px'
  },
  search_container_inside_nav: {
    display: {
      default: 'none',
      '@media (min-width: 840px)': 'block'
    },
    paddingTop: {
      default: 0,
      '@media (min-width: 840px)': '16px'
    }
  },
  hidden_on_mobile_then_flex: {
    display: {
      default: 'none',
      '@media (min-width: 840px)': 'flex'
    }
  },
  search_container_on_mobile: {
    display: {
      default: 'flex',
      '@media (min-width: 840px)': 'none'
    },
    marginBlock: '16px',
    marginInline: '0',
    width: '100%',
    maxWidth: {
      default: 'none',
      '@media (min-width: 840px)': '384px'
    },
    justifyContent: 'flex-end'
  },
  nav_container: {
    overflowY: 'scroll',
    backgroundColor: 'var(--bg-wash)',
    flexGrow: 1,
    paddingLeft: {
      default: '16px',
      '@media (min-width: 840px)': 0
    },
    width: {
      default: '100%',
      '@media (min-width: 840px)': '336px'
    }
  },
  aside: {
    flexDirection: 'column',
    width: '100%',
    paddingBottom: {
      default: '32px',
      '@media (min-width: 840px)': 0
    },
    zIndex: 10,
    display: {
      '@media (min-width: 840px)': 'flex'
    },
    flexGrow: {
      '@media (min-width: 840px)': 1
    },
    maxWidth: {
      '@media (min-width: 840px)': '336px'
    }
  },
  aside_open: {
    display: 'block',
    zIndex: 40
  },
  aside_close: {
    display: {
      default: 'none',
      '@media (min-width: 840px)': 'block'
    }
  },
  nav: {
    width: '100%',
    flexGrow: 1,
    paddingRight: {
      '@media (min-width: 840px)': '20px'
    },
    paddingTop: '12px',
    height: {
      '@media (min-width: 840px)': 'auto'
    },
    paddingBottom: {
      '@media (min-width: 840px)': '24px'
    }
  }
});

const mobileOrTabletMediaQuery = '(max-width: 839px)';

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(isOpen => !isOpen), []);

  const scrollParentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // While the overlay is open, disable body scroll.
  useEffect(() => {
    const preferredScrollParent = scrollParentRef.current;
    if (isOpen && preferredScrollParent) {
      disableBodyScroll(preferredScrollParent);
      return () => enableBodyScroll(preferredScrollParent);
    }
  }, [isOpen]);

  // Close the overlay on any navigation.
  useEffect(() => {
    const close = () => setIsOpen(false);

    router.events.on('routeChangeComplete', close);
    router.events.on('routeChangeError', close);
    return () => {
      router.events.off('routeChangeComplete', close);
      router.events.off('routeChangeError', close);
    };
  }, [router.events]);

  // Also close the overlay if the window gets resized past mobile layout.
  // (This is also important because we don't want to keep the body locked!)
  useEffect(() => {
    const media = window.matchMedia(mobileOrTabletMediaQuery);
    function closeIfNeeded() {
      if (!media.matches) {
        setIsOpen(false);
      }
    }
    media.addEventListener('change', closeIfNeeded);
    return () => {
      media.removeEventListener('change', closeIfNeeded);
    };
  }, []);

  // Only when isMobileOrTablet is true do we care about if isOpen should be applied.
  // On desktop, we don't care about isOpen at all.
  const isMobileOrTablet = useMediaQuery(mobileOrTabletMediaQuery, false);

  return (
    <div {...stylex.props(styles.container, isMobileOrTablet && isOpen && styles.container_open)}>
      <div {...stylex.props(styles.header, isMobileOrTablet && isOpen && styles.header_open)}>
        <div {...stylex.props(styles.header_inner)}>
          <button
            type="button"
            aria-label="Menu"
            onClick={handleOpen}
            {...stylex.props(styles.menu_button, isMobileOrTablet && isOpen && styles.menu_button_open)}
          >
            {isOpen
              ? <IconClose {...stylex.props(styles.icon)} />
              : <IconHambuger {...stylex.props(styles.icon)} />}
          </button>
          <Link href="/" {...stylex.props(styles.title)}>
            <MirrorZLogo {...stylex.props(styles.logo)} />
            {/* <Logo className="text-sm mr-2 w-8 h-8 text-link dark:text-link-dark" /> */}
            <h1>MirrorZ Help</h1>
          </Link>
          <div {...stylex.props(styles.hidden_on_mobile_then_flex)}>
            <DarkModeSwitch />
          </div>
        </div>
        {!isOpen && (
          <div {...stylex.props(styles.search_container_inside_nav)}>
            <SearchButtonInSideNav />
          </div>
        )}
        {/* <div className="px-0 pt-2 w-full 2xl:max-w-xs hidden lg:flex items-center self-center border-b-0 lg:border-b border-border dark:border-border-dark">
          <p>Tab</p>
        </div> */}
        <div {...stylex.props(styles.search_container_on_mobile)}>
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
        style={stylex.props(styles.nav_container).style}
        {...stylex.props(styles.nav_container)}
        className={clsx('no-bg-scrollbar', stylex.props(styles.nav_container).className)}
      >
        <aside
          {...stylex.props(styles.aside, isOpen ? styles.aside_open : styles.aside_close)}
        >
          <nav
            role="navigation"
            {...stylex.props(styles.nav)}
          >
            <Sidebar />
          </nav>
        </aside>
      </div>
    </div>
  );
}

export default memo(Nav);
