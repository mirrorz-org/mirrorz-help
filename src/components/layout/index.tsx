import * as stylex from '@stylexjs/stylex';
import { Suspense, lazy } from 'react';

import Nav from './nav';
import { useRouter } from 'next/router';
import type { ToC } from '@/lib/server/parse-markdown';
import ToCAside from './toc';
import Footer from './footer';
import { useSearchHotKeys } from '@/hooks/use-search-hotkeys';
import Header from './header';
import MetadataCard from '../page-meta';

import { CurrentCnameProvider } from '@/contexts/current-cname';
import { SelectedMirrorProvider } from '@/contexts/current-selected-mirror';
import { MirrorEnableHttpsProvider } from '@/contexts/mirror-enable-https';
import { FrontMatterProvider } from '@/contexts/current-frontmatters';
import { MirrorEnableSudoProvider } from '@/contexts/mirror-enable-sudo';

import type { MetaFromFrontMatters } from '@/types/front-matter';

import routesJson from '@/routes.json';
import { EMPTY_ARRAY } from '../../lib/client/constant';

const SearchCommandK = lazy(() => import('../search/cmdk'));
const Dialog = lazy(() => import('../dialog'));

const styles = stylex.create({
  container: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'auto',
      '@media (min-width: 840px)': '320px auto',
      '@media (min-width: 1280px)': '320px auto 320px'
    }
  },
  sidenav_container: {
    position: {
      default: 'fixed',
      '@media (min-width: 840px)': 'sticky'
    },
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 50,
    boxShadow: {
      default: 'var(--nav-shadow)',
      '@media (min-width: 840px)': 'none'
    }
  },
  main: {
    minWidth: 0,
    overflowWrap: 'break-word'
  },
  main_spacer: {
    height: '64px',
    marginBottom: '8px',
    display: {
      '@media (min-width: 840px)': 'none'
    }
  },
  toc: {
    display: {
      default: 'none',
      '@media (min-width: 1280px)': 'block'
    },
    maxWidth: {
      '@media (min-width: 840px)': '336px'
    }
  },
  content_wrapper: {
    paddingLeft: 0
  },
  content_inner: {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: {
      default: '20px',
      '@media (min-width: 640px)': '48px'
    },
    paddingRight: {
      default: '20px',
      '@media (min-width: 640px)': '48px'
    }
  }
});

interface LayoutProps {
  toc?: ToC[],
  meta?: MetaFromFrontMatters,
  cname?: string | null,
  isContent?: boolean
}

export function Layout({ children, meta, toc = EMPTY_ARRAY, cname, isContent = false }: React.PropsWithChildren<LayoutProps>) {
  const { asPath } = useRouter();
  useSearchHotKeys();

  if (process.env.NODE_ENV !== 'production' && isContent) {
    // Validate Front Matters
    if (!meta) {
      throw new Error('Current Page is missing Front Matters!');
    }
    if (!cname) {
      throw new Error('Current Page\'s Front Matters is missing "cname" field!');
    }

    // Validate routes.json
    for (const [href, routeMeta] of Object.entries(routesJson)) {
      if (!href.startsWith('/') || !href.endsWith('/')) {
        throw new Error(`Invalid route in routes.json: ${href} should start and end with "/"`);
      }
      if (!routeMeta.cname) {
        throw new Error(`Invalid route in routes.json: ${href} is missing "cname" field`);
      }
      if (asPath.startsWith(href) && routeMeta.cname !== cname) {
        throw new Error(`Invalid route in routes.json: ${href} has conflicted "cname" field, ${routeMeta.cname} in routes.json while "${cname}" in Front Matters`);
      }
      if (routeMeta.title.length >= routeMeta.fullTitle.length) {
        throw new Error(`Invalid route in routes.json: ${href} "title" field is longer than "fullTitle" field, which is not allowed`);
      }
      if (!routeMeta.fullTitle.startsWith(routeMeta.title)) {
        throw new Error(`Invalid route in routes.json: ${href} "fullTitle" field should start with "title" field`);
      }
    }
  }

  return (
    <FrontMatterProvider meta={meta}>
      <CurrentCnameProvider cname={cname || null}>
        {/** Always reset state after navigation */}
        <SelectedMirrorProvider key={asPath} cname={cname || null}>
          <MirrorEnableHttpsProvider>
            <MirrorEnableSudoProvider>
              <div {...stylex.props(styles.container)}>
                <div {...stylex.props(styles.sidenav_container)}>
                  {/**
                  * !!ALERT!! PERFORMANCE OPTIMIZATION HACK AHEAD!
                  *
                  * By adding more Suspense boundaries, React will use this as a signal to hydrate them asynchronously instead of doing everything in a single pass. This would reduce long tasks during hydration.
                  * It's a bit risky because if something suspends, we'll render null. But we don't have anything suspending directly inside these trees. If we add something, we'll need to give it its own Suspense to prevent triggering these.
                  */}
                  <Suspense fallback={null}>
                    <Nav />
                  </Suspense>
                </div>
                <main {...stylex.props(styles.main)}>
                  <div {...stylex.props(styles.main_spacer)} />

                  {isContent && meta && <Header title={meta.title} />}

                  <div {...stylex.props(styles.content_wrapper)}>
                    <div {...stylex.props(styles.content_inner)}>
                      {children}

                      {isContent && <MetadataCard />}
                    </div>
                  </div>

                  <Footer />
                </main>
                <div {...stylex.props(styles.toc)}>
                  {/**
                  * !!ALERT!! PERFORMANCE OPTIMIZATION HACK AHEAD!
                  * No fallback UI so need to be careful not to suspend directly inside.
                  */}
                  <Suspense fallback={null}>
                    {toc.length > 0 && (
                      <ToCAside key={asPath} toc={toc} />
                    )}
                  </Suspense>
                </div>
                <Suspense fallback={null}>
                  <SearchCommandK />
                </Suspense>
                <Suspense fallback={null}>
                  <Dialog />
                </Suspense>
              </div>
            </MirrorEnableSudoProvider>
          </MirrorEnableHttpsProvider>
        </SelectedMirrorProvider>
      </CurrentCnameProvider>
    </FrontMatterProvider>
  );
}
