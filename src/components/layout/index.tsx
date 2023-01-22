import style9 from 'style9';
import { Suspense } from 'react';

import Nav from './nav';
import { useRouter } from 'next/router';
import DocumentationWrapper from './documentation-wrapper';
import type { ToC } from '@/lib/server/parse-markdown';
import ToCAside from './toc';
import Footer from './footer';
import { useSearchHotKeys } from '@/hooks/use-search-hotkeys';
import SearchCommandK from '../search/cmdk';
import Header from './header';

import { CurrentCnameProvider } from '@/contexts/current-cname';
import { SelectedMirrorProvider } from '@/contexts/current-selected-mirror';
import { MirrorEnableHttpsProvider } from '@/contexts/mirror-enable-https';
import type { MetaFromFrontMatters } from '../../types/front-matter';
import { FrontMatterProvider } from '../../contexts/current-frontmatters';
import MetadataCard from '../page-meta';

const styles = style9.create({
  container: {
    display: 'grid',
    gridTemplateColumns: 'auto',
    '@media screen and (min-width: 840px)': {
      gridTemplateColumns: '320px auto'
    },
    '@media screen and (min-width: 1280px)': {
      gridTemplateColumns: '320px auto 320px'
    }
  },
  sidenav_container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 50,
    boxShadow: 'var(--nav-shadow)',
    '@media screen and (min-width: 840px)': {
      position: 'sticky',
      boxShadow: 'none'
    }
  },
  main: {
    minWidth: 0
  },
  main_spacer: {
    height: '64px',
    marginBottom: '8px',
    '@media screen and (min-width: 840px)': {
      display: 'none'
    }
  },
  toc: {
    display: 'none',
    '@media screen and (min-width: 840px)': {
      maxWidth: '336px'
    },
    '@media screen and (min-width: 1280px)': {
      display: 'block'
    }
  },
  article: {
    overflowWrap: 'break-word'
  },
  content_wrapper: {
    paddingLeft: 0
  },
  content_container: {
    paddingLeft: '20px',
    paddingRight: '20px',
    '@media screen and (min-width: 640px)': {
      paddingLeft: '48px',
      paddingRight: '48px'
    }
  }
});

interface LayoutProps {
  toc?: ToC[],
  meta?: MetaFromFrontMatters,
  cname?: string | null,
  isContent?: boolean
}

export function Layout({ children, meta, toc = [], cname, isContent = false }: React.PropsWithChildren<LayoutProps>) {
  const { asPath } = useRouter();
  useSearchHotKeys();

  return (
    <FrontMatterProvider meta={meta}>
      <CurrentCnameProvider cname={cname || null}>
        {/** Always reset state after navigation */}
        <SelectedMirrorProvider key={asPath} cname={cname || null}>
          <MirrorEnableHttpsProvider>
            <div className={styles('container')}>
              <div className={styles('sidenav_container')}>
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
              <main className={styles('main')}>
                <div className={styles('main_spacer')} />
                <article className={styles('article')} key={asPath}>
                  {isContent && meta && <Header title={meta.title} />}
                  <div className={styles('content_wrapper')}>
                    <div className={styles('content_container')}>
                      {isContent
                        ? (
                          <DocumentationWrapper>
                            {children}
                          </DocumentationWrapper>
                        )
                        : children}

                      {isContent && <MetadataCard />}
                    </div>
                  </div>
                </article>
                <Footer />
              </main>
              <div className={styles('toc')}>
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
              <SearchCommandK />
            </div>
          </MirrorEnableHttpsProvider>
        </SelectedMirrorProvider>
      </CurrentCnameProvider>
    </FrontMatterProvider>
  );
}
